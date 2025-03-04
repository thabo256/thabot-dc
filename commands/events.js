const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, GuildScheduledEventManager, time, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('show all events in the server')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  async execute(interaction) {
    const eventManager = new GuildScheduledEventManager(interaction.guild);

    const events = await eventManager.fetch();

    if (events.length == 0) {
      return interaction.reply('No events scheduled');
    }

    let reply = '';
    let embeds = [];

    events.forEach((event) => {
      embeds.push(
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle(event.name)
          .setURL(event.url)
          .setDescription(`${event.description}\n\n-# <:pin:1343011687380553738>${event.entityMetadata.location}\n${time(new Date(event.scheduledStartTimestamp), 'R')}`)
          .setTimestamp(event.scheduledStartTimestamp)
      );
    });

    await interaction.reply({ embeds });
  },
};
