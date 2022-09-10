const { SlashCommandBuilder, time, userMention } = require('discord.js');

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
    let roles = '';
    for (const role of member.roles.cache) {
      roles += role[1].toString();
    }
    await interaction.reply(`${userMention(user.id)} was created ${time(user.createdAt, 'R')} and joined this server ${time(member.joinedAt, 'R')}\nroles: ${roles}`);
  },
};
