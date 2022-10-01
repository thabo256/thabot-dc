const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickbot')
    .setDescription('set nickname of bot')
    .addStringOption((option) => option.setName('name').setDescription('new nickname for bot)').setRequired(true)),
  test: true,
  async execute(interaction) {
    const name = interaction.options.getString('name');
    if (name.length > 32) return interaction.reply({ content: 'your name is too long', ephemeral: true });
    const me = interaction.guild.members.me;
    await me.setNickname(name);
    await interaction.reply(`set nickname to ${name}`);
  },
};
