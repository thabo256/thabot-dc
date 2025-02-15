const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      // Dynamically executing commands
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral }).catch(console.error);
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral }).catch(console.error);
        }
      }
    } else if (interaction.isButton()) {
      // Dynamically executing buttons
      const ids = interaction.customId.split('-');
      const button = interaction.client.buttons.get(ids[0]);

      if (!button) return;

      try {
        await button.execute(interaction, ids);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while handling this button press!', flags: MessageFlags.Ephemeral }).catch(console.error);
      }
    }
  },
};
