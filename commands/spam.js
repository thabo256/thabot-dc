const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Spam this chanel')
    .addNumberOption((option) => option.setName('count').setDescription('how many times').setRequired(true))
    .addStringOption((option) => option.setName('text').setDescription('what to spam').setRequired(true)),
  test: true,
  async execute(interaction) {
    const count = interaction.options.getNumber('count');
    const text = interaction.options.getString('text');

    if (count > 100) {
      return interaction.reply({ content: `${count} is too much! Please use a number lower than 100!`, ephemeral: true });
    }

    await interaction.reply({ content: `now spamming "${text}" ${count} times`, ephemeral: true });
    for (let i = 0; i < count; i++) {
      await interaction.channel.send(text);
    }
  },
};
