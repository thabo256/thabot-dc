const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickbot')
    .setDescription('set nickname of bot')
    .addStringOption(option => option.setName('name').setDescription('new nickname for bot)').setRequired(true).setMaxLength(32))
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const me = interaction.guild.members.me;
    await me.setNickname(name);
    await interaction.reply(`set nickname to ${name}`);
  },
};
