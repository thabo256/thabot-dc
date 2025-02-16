const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play Tic Tac Toe')
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  async execute(interaction) {
    const components = [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('tictactoe-join').setLabel('join').setStyle(ButtonStyle.Success))];

    await interaction.reply({ content: `${userMention(interaction.user.id)} wants to play tictactoe. press join to enter the game!`, components });
  },
};
