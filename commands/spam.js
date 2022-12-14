const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Spam this chanel')
    .addNumberOption((option) => option.setName('count').setDescription('how many times').setRequired(true).setMinValue(1).setMaxValue(100))
    .addStringOption((option) => option.setName('text').setDescription('what to spam').setRequired(true).setMaxLength(2000)),
  test: true,
  async execute(interaction) {
    const count = interaction.options.getNumber('count');
    const text = interaction.options.getString('text');

    await interaction.reply({ content: `now spamming "${text.substring(0, 100)}" ${count} times`, ephemeral: true });
    for (let i = 0; i < count; i++) {
      await interaction.channel.send(text);
    }
  },
};
