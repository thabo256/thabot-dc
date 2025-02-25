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
      console.log(manager);
      
      event = await manager.fetch(id);
      if (event) {
        break;
      }
    }

    console.log(event);
    

    // const event = await eventManager.create({
    //   name: 'Test Event',
    //   scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60),
    //   scheduledEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    //   privacyLevel: 2, // Guild only
    //   entityType: 3, // External
    //   entityMetadata: { location: 'Berlin' },
    // });

    await interaction.reply('No events scheduled');
  },
};
