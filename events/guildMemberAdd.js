module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const newRole = member.guild.roles.cache.find((role) => role.name === 'new');
    member.roles.add(newRole);
  },
};
