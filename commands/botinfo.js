const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType, time } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('get ')
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .addSubcommand((subcommand) => subcommand.setName('servers').setDescription('see the servers the bot is in'))
    .addSubcommand((subcommand) => subcommand.setName('users').setDescription('see the users that installed the bot'))
    .addSubcommand((subcommand) => subcommand.setName('uptime').setDescription('view the bot uptime')),
  test: true,
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'servers') {
      const guilds = await interaction.client.guilds.fetch();
      const response = guilds.map((guild) => `- **${guild.name}** (\`${guild.id}\`)`).join('\n');
      const app = await interaction.client.application.fetch();
      return interaction.reply({ content: `The bot is in approximately \`${app.approximateGuildCount}\` servers:\n${response}`, flags: MessageFlags.Ephemeral });
    }
    if (interaction.options.getSubcommand() === 'users') {
      const app = await interaction.client.application.fetch();
      return interaction.reply({ content: `The bot is installed by approximately \`${app.approximateUserInstallCount}\` users`, flags: MessageFlags.Ephemeral });
    }
    if (interaction.options.getSubcommand() === 'uptime') {
      return interaction.reply({ content: `The bot has been up since ${time(interaction.client.readyAt, 'R')}`, flags: MessageFlags.Ephemeral });
    }
  },
};
