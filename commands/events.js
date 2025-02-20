const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags, GuildScheduledEventManager } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('show all events in the server')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  async execute(interaction) {
    const eventManager = new GuildScheduledEventManager(interaction.guild);

    const events = await eventManager.fetch();

    console.log(events);
    

    // const event = await eventManager.create({
    //   name: 'Test Event',
    //   scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60),
    //   scheduledEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    //   privacyLevel: 2, // Guild only
    //   entityType: 3, // External
    //   entityMetadata: { location: 'Berlin' },
    // });

    await interaction.reply({ content: `aaa`, flags: MessageFlags.Ephemeral });
  },
};
