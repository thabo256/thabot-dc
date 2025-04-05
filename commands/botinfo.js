const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('get ')
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .addSubcommand((subcommand) => subcommand.setName('servers').setDescription('see the servers the bot is in'))
    .addSubcommand((subcommand) => subcommand.setName('users').setDescription('see the users that installed the bot')),
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
  },
};
