const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      // Dynamically executing commands
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`Command ${interaction.commandName} not found.`);
        return;
      }

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
    } else if (interaction.isAutocomplete()) {
      // Dynamically executing autocomplete
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`Command ${interaction.commandName} not found.`);
        return;
      }

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isButton()) {
      // Dynamically executing buttons
      const ids = interaction.customId.split('-');
      const button = interaction.client.buttons.get(ids[0]);

      if (!button) {
        console.error(`Button ${ids[0]} not found.`);
        return;
      }

      try {
        await button.execute(interaction, ids);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while handling this button press!', flags: MessageFlags.Ephemeral }).catch(console.error);
      }
    } else if (interaction.isStringSelectMenu()) {
      // Dynamically executing select menus
      const ids = interaction.customId.split('-');
      const selectMenu = interaction.client.selectMenus.get(ids[0]);

      if (!selectMenu) {
        console.error(`Select Menu ${ids[0]} not found.`);
        return;
      }

      try {
        await selectMenu.execute(interaction, ids);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while handling this select menu!', flags: MessageFlags.Ephemeral }).catch(console.error);
      }
    } else if (interaction.isModalSubmit()) {
      // Dynamically executing modals
      const ids = interaction.customId.split('-');
      const modal = interaction.client.modals.get(ids[0]);

      if (!modal) {
        console.error(`Modal ${ids[0]} not found.`);
        return;
      }

      try {
        await modal.execute(interaction, ids);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while handling this modal!', flags: MessageFlags.Ephemeral }).catch(console.error);
      }
    }
  },
};
