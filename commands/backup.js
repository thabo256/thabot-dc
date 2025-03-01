const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType, AttachmentBuilder } = require('discord.js');

const fetchChannel = async (channel) => {
  return { id: channel.id, name: channel.name, viewable: channel.viewable };
};

module.exports = {
  data: new SlashCommandBuilder().setName('backup').setDescription('backup this server').setContexts([InteractionContextType.Guild]).setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  test: true,
  async execute(interaction) {
    // check for permission
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
    }

    await interaction.reply('Creating backup...');

    const channels = await interaction.guild.channels.fetch();
    const backup = { id: interaction.guild.id, name: interaction.guild.name, channels: [{ textChannels: [], voiceChannels: [] }] };

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
    }

    const file = new AttachmentBuilder(Buffer.from(JSON.stringify(backup, null, 2)), { name: 'backup.json' });

    return interaction.editReply({ content: 'download backup file:', files: [file] });
  },
};
