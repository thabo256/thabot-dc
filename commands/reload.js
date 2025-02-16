const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('reload a command or button')
    .addStringOption((option) =>
      option.setName('type').setDescription('the type of file to reload').setRequired(true).addChoices({ name: 'command', value: 'commands' }, { name: 'button', value: 'buttons' })
    )
    .addStringOption((option) => option.setName('file').setDescription('the file to reload').setRequired(true).setAutocomplete(true)),
  test: true,
  async autocomplete(interaction) {
    const type = interaction.options.getString('type');
    const focusedValue = interaction.options.getFocused();

    const commandsPath = path.join(__dirname, '..', type);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    const filtered = commandFiles.filter((choice) => choice.startsWith(focusedValue));
    await interaction.respond(
      filtered.map((choice) => {
        choice = choice.replace('.js', '');
        return { name: choice, value: choice };
      })
    );
  },
  async execute(interaction) {
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
    }

    const type = interaction.options.getString('type');
    const file = interaction.options.getString('file');

    const filePath = path.join(__dirname, '..', type, file) + '.js';
    try {
      fs.accessSync(filePath);
    } catch (error) {
      return interaction.reply({ content: `The file \`${file}\` does not exist in \`${type}\`.`, flags: MessageFlags.Ephemeral });
    }

    delete require.cache[require.resolve(filePath)];

    try {
      const newFile = require(filePath);
      if (type === 'commands') {
        interaction.client.commands.set(newFile.data.name, newFile);
        await interaction.reply({ content: `Command \`${newFile.data.name}\` was reloaded!`, flags: MessageFlags.Ephemeral });
      } else if (type === 'buttons') {
        interaction.client.buttons.set(newFile.name, newFile);
        await interaction.reply({ content: `Button \`${newFile.name}\` was reloaded!`, flags: MessageFlags.Ephemeral });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `There was an error while reloading \`${file}\`:\n\`${error.message}\``, flags: MessageFlags.Ephemeral });
    }
  },
};
