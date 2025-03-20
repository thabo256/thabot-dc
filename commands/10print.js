const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('10print')
    .setDescription('10print')
    .addNumberOption((option) => option.setName('width').setDescription('width of the output').setRequired(true).setMinValue(10).setMaxValue(100))
    .addNumberOption((option) => option.setName('height').setDescription('height of the output').setRequired(true).setMinValue(10).setMaxValue(19))
    .addBooleanOption((option) => option.setName('include-x').setDescription('include the ╳'))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  async execute(interaction) {
    const width = interaction.options.getNumber('width');
    const height = interaction.options.getNumber('height');
    const includeX = interaction.options.getBoolean('include-x');

    await interaction.reply('...');

    const chars = ['╱', '╲'];

    if (includeX) {
      chars.push('╳');
    }

    let output = '';

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
      output += '\n';
      await interaction.editReply(`\`\`\`${output}\`\`\``);
    }
  },
};
