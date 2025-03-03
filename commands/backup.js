const { Uint8ArrayWriter, TextReader, ZipWriter } = require('@zip.js/zip.js');
require('dotenv').config();

const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType, AttachmentBuilder } = require('discord.js');

const fetchChannel = async (channel) => {
  if (!channel.viewable) {
    return { id: channel.id, name: channel.name, viewable: channel.viewable };
  }
  let messages = await channel.messages.fetch({ limit: 100 });
  let lastMessageId = undefined;
  while (messages.last()?.id !== lastMessageId) {
    lastMessageId = messages.last()?.id;
    messages = messages.concat(await channel.messages.fetch({ limit: 100, before: messages.last().id }));
  }

  return {
    id: channel.id,
    name: channel.name,
    viewable: channel.viewable,
    messages: messages.map((message) => ({ id: message.id, timestamp: message.createdTimestamp, author: message.author.username, content: message.content })),
  };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('backup this server')
    .addStringOption((option) => option.setName('compression').setDescription('compression method').addChoices({ name: 'zip', value: 'zip' }, { name: 'none', value: 'none' }))
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  test: true,
  async execute(interaction) {
    // check for permission
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
    }

    await interaction.reply('Creating backup...');

    const channels = await interaction.guild.channels.fetch();
    const backup = { id: interaction.guild.id, name: interaction.guild.name, channels: [{ textChannels: [], voiceChannels: [] }] };

    const size = channels.filter((channel) => channel.isTextBased()).size;
    let i = 0;
    await interaction.editReply(`Creating backup...\n-# ${i}/${size}`);

    for (const channel of channels.values()) {
      if (!channel.isTextBased()) continue;

      if (channel.parent == undefined) {
        if (channel.isVoiceBased()) {
          backup.channels[0].voiceChannels[channel.position] = await fetchChannel(channel);
        } else {
          backup.channels[0].textChannels[channel.position] = await fetchChannel(channel);
        }
      } else {
        if (backup.channels[channel.parent.position + 1] == undefined) {
          backup.channels[channel.parent.position + 1] = { id: channel.parent.id, name: channel.parent.name, textChannels: [], voiceChannels: [] };
        }

        if (channel.isVoiceBased()) {
          backup.channels[channel.parent.position + 1].voiceChannels[channel.position] = await fetchChannel(channel);
        } else {
          backup.channels[channel.parent.position + 1].textChannels[channel.position] = await fetchChannel(channel);
        }
      }

      await interaction.editReply(`Creating backup...\n-# ${++i}/${size}`);
    }

    const compressionMethod = interaction.options.getString('compression');

    if (compressionMethod === 'none') {
      const file = new AttachmentBuilder(Buffer.from(JSON.stringify(backup, null, 2)), { name: 'backup.json' });

      return interaction.editReply({ content: 'download backup file:', files: [file] });
    }

    const writer = new ZipWriter(new Uint8ArrayWriter());
    await writer.add('backup.json', new TextReader(JSON.stringify(backup)), { level: 9 });
    const zipData = await writer.close();

    const file = new AttachmentBuilder(Buffer.from(zipData), { name: 'backup.zip' });

    return interaction.editReply({ content: 'download backup file:', files: [file] });
  },
};
