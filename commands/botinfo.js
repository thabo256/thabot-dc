const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('get ')
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .addSubcommand((subcommand) => subcommand.setName('servers').setDescription('see the servers the bot is in')),
  test: true,
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'servers') {
      const guilds = await interaction.client.guilds.fetch();
      const response = guilds.map((guild) => `**${guild.name}** (\`${guild.id}\`)`).join('\n');
      await interaction.reply({ content: `The bot is in the following servers:\n${response}`, flags: MessageFlags.Ephemeral });
    }
  },
};
