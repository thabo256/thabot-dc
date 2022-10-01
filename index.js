require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, /* GatewayIntentBits.GuildPresences,  */ GatewayIntentBits.MessageContent],
});

// dynamically retrieve event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// dynamically retrieve command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// dynamically retrieve button files
client.buttons = new Collection();
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith('.js'));

for (const file of buttonFiles) {
  const filePath = path.join(buttonsPath, file);
  const button = require(filePath);
  client.buttons.set(button.name, button);
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    // Dynamically executing commands
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(console.error);
    }
  } else if (interaction.isButton()) {
    // Dynamically executing buttons
    const ids = interaction.customId.split('-');
    const button = client.buttons.get(ids[0]);

    if (!button) return;

    try {
      await button.execute(interaction, ids);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while handling this button press!', ephemeral: true });
    }
  }
});

// client.on('guildMemberAdd', member => {
//   console.log('member');
// })

// login using login token
client.login(process.env.LOGIN_TOKEN);
