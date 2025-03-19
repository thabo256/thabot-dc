const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pacman')
    .setDescription('play pacman')
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  test: true,
  async execute(interaction) {
    const components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-0').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-1').setLabel('⬆️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-2').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-3').setLabel('⬅️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-4').setLabel('🔵').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-5').setLabel('➡️').setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('pacman-6').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('pacman-7').setLabel('⬇️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('pacman-8').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)
      ),
    ];

    let board = '╭─────────────────────────╮ ╭─────────────────────────╮\n│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n│ ● │     │ • │       │ • │ │ • │       │ • │     │ ● │\n│ • ╰─────╯ • ╰───────╯ • ╰─╯ • ╰───────╯ • ╰─────╯ • │\n│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭─╮ • ╭─────────────╮ • ╭─╮ • ╭─────╮ • │\n│ • ╰─────╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─────╯ • │\n│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n╰─────────╮ • │ ╰─────╮   │ │   ╭─────╯ │ • ╭─────────╯\n          │ • │ ╭─────╯   ╰─╯   ╰─────╮ │ • │          \n          │ • │ │                     │ │ • │          \n          │ • │ │   ╔═════━━━═════╗   │ │ • │          \n──────────╯ • ╰─╯   ║             ║   ╰─╯ • ╰──────────\n            •       ║             ║       •            \n──────────╮ • ╭─╮   ║             ║   ╭─╮ • ╭──────────\n          │ • │ │   ╚═════════════╝   │ │ • │          \n          │ • │ │                     │ │ • │          \n          │ • │ │   ╭─────────────╮   │ │ • │          \n╭─────────╯ • ╰─╯   ╰─────╮ ╭─────╯   ╰─╯ • ╰─────────╮\n│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n│ • ╰───╮ │ • ╰───────╯ • ╰─╯ • ╰───────╯ • │ ╭───╯ • │\n│ ● • • │ │ • • • • • • • ▐█▌ • • • • • • • │ │ • • ● │\n╰───╮ • │ │ • ╭─╮ • ╭─────────────╮ • ╭─╮ • │ │ • ╭───╯\n╭───╯ • ╰─╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─╯ • ╰───╮\n│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n│ • ╭─────────╯ ╰─────╮ • │ │ • ╭─────╯ ╰─────────╮ • │\n│ • ╰─────────────────╯ • ╰─╯ • ╰─────────────────╯ • │\n│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n╰─────────────────────────────────────────────────────╯';

    await interaction.reply({ content: `\`\`\`${board}\`\`\``, components });

    for (let i = 0; i < 20; i++) {
      await interaction.editReply({ content: `\`\`\`${board = board.replace(/▐█▌./, ' ▐█▌')}\`\`\``, components });
      await new Promise(r => setTimeout(r, 500));
    }
  },
};
