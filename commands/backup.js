const { Uint8ArrayWriter, TextReader, ZipWriter } = require('@zip.js/zip.js');
require('dotenv').config();

const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType, AttachmentBuilder, MessageReferenceType } = require('discord.js');

const fetchChannel = async (channel, includeReactions) => {
  if (!channel.viewable) {
    return { id: channel.id, name: channel.name, viewable: channel.viewable };
  }
  // fetch first 100 messages
  let messages = await channel.messages.fetch({ limit: 100 });
  let lastMessageId = undefined;
  // fetch until you have all messages
  while (messages.last()?.id !== lastMessageId) {
    lastMessageId = messages.last()?.id;
    messages = messages.concat(await channel.messages.fetch({ limit: 100, before: messages.last().id }));
  }

  let messageArray = [];
  for (const message of messages.values()) {
    // create message object
    const messageObject = { id: message.id, timestamp: message.createdTimestamp, author: message.author.username };

    // add optional fields
    if (message.content) {
      messageObject.content = message.content;
    }
    if (message.reference) {
      if (message.reference.type === MessageReferenceType.Default) {
        messageObject.reference = message.reference.messageId;
      } else if (message.reference.type === MessageReferenceType.Forward) {
        messageObject.forwarded = message.reference.messageId;
      }
    }
    if (message.hasThread) {
      messageObject.thread = await fetchChannel(message.thread, includeReactions);
    }
    if (message.attachments.size > 0) {
      messageObject.attachments = [];
      for (const attachment of message.attachments.values()) {
        messageObject.attachments.push(attachment.name);
      }
    }
    if (message.embeds.length > 0) {
      messageObject.embeds = [];
      for (const embed of message.embeds.map((embed) => embed.toJSON())) {
        if (embed.type === 'rich') {
          messageObject.embeds.push(embed);
        }
      }
    }
    if (message.poll) {
      const poll = message.poll.toJSON();
      for (const a of message.poll.answers.values()) {
        const answer = a.toJSON();
        if (a.emoji) answer.emoji = a.emoji.toString();
        const voters = await a.fetchVoters();
        answer.voters = voters.map((user) => user.username);
        poll.answers[a.id - 1] = answer;
      }
      messageObject.poll = poll;
    }
    if (message.pinned) {
      messageObject.pinned = message.pinned;
    }
    if (message.interaction) {
      // deprecated but interactionMetadata doesn't provide comandName
      messageObject.interaction = message.interaction.commandName;
    }
    if (includeReactions) {
      if (message.reactions.cache.size > 0) {
        messageObject.reactions = [];
        for (const reaction of message.reactions.cache.values()) {
          const users = (await reaction.users.fetch().catch(console.error)) ?? reaction.users.cache;
          messageObject.reactions.push({ emoji: reaction.emoji.toString(), users: [...users.values()].map((user) => user.username) });
        }
      }
    }

    messageArray.push(messageObject);
  }

  return { id: channel.id, name: channel.name, viewable: channel.viewable, messages: messageArray };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('backup this server')
    .addStringOption((option) => option.setName('compression').setDescription('compression method').addChoices({ name: 'zip', value: 'zip' }, { name: 'none', value: 'none' }))
    .addBooleanOption((option) => option.setName('include-reactions').setDescription('include reactions in backup; this will take way longer'))
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  test: true,
  async execute(interaction) {
    // check for permission
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
    }

    const includeReactions = interaction.options.getBoolean('include-reactions') ?? false;

    await interaction.reply('Creating backup...');

    const channels = await interaction.guild.channels.fetch();
    const backup = { id: interaction.guild.id, name: interaction.guild.name, backup: { time: new Date().toISOString(), timestamp: Date.now() }, channels: [{ textChannels: [], voiceChannels: [] }] };

    // counter for progress
    const size = channels.filter((channel) => channel.isTextBased()).size;
    let i = 0;
    await interaction.editReply(`Creating backup...\n-# ${i}/${size}`);

    for (const channel of channels.values()) {
      if (!channel.isTextBased()) continue;

      if (channel.parent == undefined) {
        // channels not in a category
        if (channel.isVoiceBased()) {
          backup.channels[0].voiceChannels[channel.position] = await fetchChannel(channel, includeReactions);
        } else {
          backup.channels[0].textChannels[channel.position] = await fetchChannel(channel, includeReactions);
        }
      } else {
        // channels in a category
        if (backup.channels[channel.parent.position + 1] == undefined) {
          // create category if it doesn't exist
          backup.channels[channel.parent.position + 1] = { id: channel.parent.id, name: channel.parent.name, textChannels: [], voiceChannels: [] };
        }

        if (channel.isVoiceBased()) {
          backup.channels[channel.parent.position + 1].voiceChannels[channel.position] = await fetchChannel(channel, includeReactions);
        } else {
          backup.channels[channel.parent.position + 1].textChannels[channel.position] = await fetchChannel(channel, includeReactions);
        }
      }

      // update progress
      await interaction.editReply(`Creating backup...\n-# ${++i}/${size}`);
    }

    // get compression method from user input
    const compressionMethod = interaction.options.getString('compression');

    if (compressionMethod === 'none') {
      const file = new AttachmentBuilder(Buffer.from(JSON.stringify(backup, null, 2)), { name: 'backup.json' });

      return interaction.editReply({ content: 'download backup file:', files: [file] });
    }

    // default to zip compression
    const writer = new ZipWriter(new Uint8ArrayWriter());
    await writer.add('backup.json', new TextReader(JSON.stringify(backup)), { level: 9 });
    const zipData = await writer.close();

    const file = new AttachmentBuilder(Buffer.from(zipData), { name: 'backup.zip' });

    return interaction.editReply({ content: 'download backup file:', files: [file] });
  },
};
