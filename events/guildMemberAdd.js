module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (member.guild.id === '1025777907790008361') {
      const newRole = member.guild.roles.cache.find((role) => role.name === 'JIA10');
      member.roles.add(newRole);
    }
  },
};
