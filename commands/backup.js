const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('backup this server')
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
    test: true,
  async execute(interaction) {
    // check for permission
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
    }

    const channels = await interaction.guild.channels.fetch();

    for (const channel of channels.values()) {
      console.log(channel.parent?.name, channel.name, channel.isTextBased(), channel.viewable, channel.position);
    }
    
    interaction.reply('Backup failed');
  },
};
