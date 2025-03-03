const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags, GuildScheduledEventManager, time, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('show all events in the server')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  async execute(interaction) {
    const eventManager = new GuildScheduledEventManager(interaction.guild);

    const events = await eventManager.fetch();

    let reply = '';

    events.forEach((event) => {
      reply += `# ${event.name}\n`;
      reply += `${time(new Date(event.scheduledStartTimestamp), 'R')}\n`;
      reply += `-# <:pin:1343011687380553738>${event.entityMetadata.location}\n\n`;
      reply += event.description.replace(/^/gm, '> ');
      reply += '\n\n';
    });

    // const components = [
    //   new ActionRowBuilder().addComponents(
    //     new ButtonBuilder().setCustomId('events-0').setLabel('monday').setStyle(ButtonStyle.Secondary),
    //     new ButtonBuilder().setCustomId('events-1').setLabel('tuesday').setStyle(ButtonStyle.Secondary),
    //     new ButtonBuilder().setCustomId('events-2').setLabel('wednesday').setStyle(ButtonStyle.Secondary),
    //     new ButtonBuilder().setCustomId('events-3').setLabel('thursday').setStyle(ButtonStyle.Secondary),
    //     new ButtonBuilder().setCustomId('events-4').setLabel('friday').setStyle(ButtonStyle.Secondary)
    //   ),
    // ];

    // const event = await eventManager.create({
    //   name: 'Test Event',
    //   scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60),
    //   scheduledEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    //   privacyLevel: 2, // Guild only
    //   entityType: 3, // External
    //   entityMetadata: { location: 'Berlin' },
    // });

    await interaction.reply(reply || 'No events scheduled');
  },
};
