const { SlashCommandBuilder, time, InteractionContextType, ApplicationIntegrationType, roleMention } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Display a user stats')
    .addUserOption((option) => option.setName('user').setDescription('user to get stats from'))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = interaction.options.getMember('user') ?? interaction.member;

    if (interaction.context !== InteractionContextType.Guild) {
      return await interaction.reply(`\`${user.tag}\` was created ${time(user.createdAt, 'R')}`);
    }

    if (interaction.guild) {
      const roles = member.roles.cache.reduce((str, role) => {
        return str + role.toString();
      }, '');
      await interaction.reply(`\`${user.tag}\` was created ${time(user.createdAt, 'R')} and joined this server ${time(member.joinedAt, 'R')}\nroles: ${roles}`);
    } else {
      const roles = member.roles.reduce((str, role) => {
        return str + roleMention(role.toString());
      }, '');
      await interaction.reply(`\`${user.tag}\` was created ${time(user.createdAt, 'R')} and joined this server ${time(new Date(member.joined_at), 'R')}\nroles: ${roles}`);
    }
  },
};
