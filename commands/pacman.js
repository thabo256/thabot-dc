const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pacman')
    .setDescription('play pacman')
    .addUserOption((option) => option.setName('user').setDescription('player of pacman'))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  test: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;

    const components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-0').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-up').setLabel('⬆️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-2').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-left').setLabel('⬅️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-4').setLabel('🔵').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-right').setLabel('➡️').setStyle(ButtonStyle.Success)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-6').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-down').setLabel('⬇️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-8').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)
      ),
    ];

    let board =
      '╭─────────────────────────╮ ╭─────────────────────────╮\n│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n│ ● │     │ • │       │ • │ │ • │       │ • │     │ ● │\n│ • ╰─────╯ • ╰───────╯ • ╰─╯ • ╰───────╯ • ╰─────╯ • │\n│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭─╮ • ╭─────────────╮ • ╭─╮ • ╭─────╮ • │\n│ • ╰─────╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─────╯ • │\n│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n╰─────────╮ • │ ╰─────╮   │ │   ╭─────╯ │ • ╭─────────╯\n          │ • │ ╭─────╯   ╰─╯   ╰─────╮ │ • │          \n          │ • │ │                     │ │ • │          \n          │ • │ │   ╔═════───═════╗   │ │ • │          \n──────────╯ • ╰─╯   ║             ║   ╰─╯ • ╰──────────\n            •       ║             ║       •            \n──────────╮ • ╭─╮   ║             ║   ╭─╮ • ╭──────────\n          │ • │ │   ╚═════════════╝   │ │ • │          \n          │ • │ │                     │ │ • │          \n          │ • │ │   ╭─────────────╮   │ │ • │          \n╭─────────╯ • ╰─╯   ╰─────╮ ╭─────╯   ╰─╯ • ╰─────────╮\n│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n│ • ╰───╮ │ • ╰───────╯ • ╰─╯ • ╰───────╯ • │ ╭───╯ • │\n│ ● • • │ │ • • • • • • •     • • • • • • • │ │ • • ● │\n╰───╮ • │ │ • ╭─╮ • ╭─────────────╮ • ╭─╮ • │ │ • ╭───╯\n╭───╯ • ╰─╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─╯ • ╰───╮\n│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n│ • ╭─────────╯ ╰─────╮ • │ │ • ╭─────╯ ╰─────────╮ • │\n│ • ╰─────────────────╯ • ╰─╯ • ╰─────────────────╯ • │\n│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n╰─────────────────────────────────────────────────────╯';

    await interaction.reply(`${userMention(user.id)}'s game of pacman\n\`\`\`\n${board}\n\`\`\``);
    await interaction.followUp({ content: userMention(user.id), components });
  },
};
