const { SlashCommandBuilder, inlineCode } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('Display a user\'s ID')
    .addUserOption((option) => option.setName('user').setDescription('user to get ID from')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (user) {
      return interaction.reply(`${user.username}: ${inlineCode(user.id)}`);
    } else {
      return interaction.reply(`${interaction.user.username}: ${inlineCode(interaction.user.id)}`);
    }
  },
};
