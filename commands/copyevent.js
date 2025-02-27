const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags, GuildScheduledEventManager, time, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('copyevent')
    .setDescription('copy an event from another server')
    .addStringOption((option) => option.setName('id').setDescription('event id').setRequired(true))
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    const eventManager = new GuildScheduledEventManager(interaction.guild);

    const guilds = await interaction.client.guilds.fetch();

    let event;

    for (const guild of guilds.values()) {
      const manager = new GuildScheduledEventManager(guild);

      try {
        event = await manager.fetch(id);
        if (event) {
          break;
        }
      } catch (e) {}
    }

    if (!event) {
      await interaction.reply({ content: 'Event not found\n-# make shure the id is correct and the bot has the permissions to see the event', flags: MessageFlags.Ephemeral });
      return;
    }

    const location = event.entityType === 3 ? event.entityMetadata.location : '';

    await eventManager.create({
      name: event.name,
      description: event.description,
      channel: interaction.channelId,
      scheduledStartTime: event.scheduledStartTimestamp,
      scheduledEndTime: event.scheduledEndTimestamp ?? event.scheduledStartTimestamp + 1000 * 60 * 60,
      privacyLevel: 2, // Guild only
      entityType: 3, // External
      entityMetadata: { location },
    });

    await interaction.reply('Event copied successfully');
  },
};
