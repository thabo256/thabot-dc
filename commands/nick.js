const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('nick other members')
    .addStringOption((option) => option.setName('name').setDescription('new nickname').setRequired(true).setMaxLength(32))
    .addUserOption((option) => option.setName('user').setDescription('user to nick'))
    .setContexts(InteractionContextType.Guild),
  test: true,
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const user = interaction.options.getUser('user');
    const member = user ? interaction.guild.members.cache.get(user.id) : interaction.member;
    await member.setNickname(name);
    await interaction.reply(`set nickname of \`${member.user.tag}\` to \`${name}\``);
  },
};
