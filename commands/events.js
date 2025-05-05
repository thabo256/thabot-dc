const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, GuildScheduledEventManager, time, channelMention, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('show all events in the server')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  async execute(interaction) {
    const eventManager = new GuildScheduledEventManager(interaction.guild);

    const events = await eventManager.fetch();

    if (events.size == 0) {
      return interaction.reply('No events scheduled');
    }

    let embeds = [];

    events.forEach(event => {
      const location = event.entityType == 3 ? `-# <:pin:1343011687380553738>${event.entityMetadata.location}` : `-# ${channelMention(event.channelId)}`;

      embeds.push(
        new EmbedBuilder()
          .setTitle(event.name)
          .setURL(event.url)
          .setDescription(`${event.description}\n\n${location}\n-# ${time(new Date(event.scheduledStartTimestamp), 'R')}`)
          .setTimestamp(event.scheduledStartTimestamp)
          .setThumbnail(event.coverImageURL())
      );
    });

    await interaction.reply({ embeds });
  },
};
