const { SlashCommandBuilder, time } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Display a user stats')
    .addUserOption((option) => option.setName('user').setDescription('user to get stats from')),
  async execute(interaction) {
    let user = interaction.options.getUser('user');
    let member;
    if (user === null) {
      user = interaction.user;
      member = interaction.member;
    } else {
      member = interaction.guild.members.cache.get(user.id);
    }
    const roles = member.roles.cache.reduce((str, role) => {
      return str + role.toString();
    }, '');
    await interaction.reply(`\`${user.tag}\` was created ${time(user.createdAt, 'R')} and joined this server ${time(member.joinedAt, 'R')}\nroles: ${roles}`);
  },
};
