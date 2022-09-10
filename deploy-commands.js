require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const testcommands = [];
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.test) {
    testcommands.push(command.data.toJSON());
  } else {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.LOGIN_TOKEN);

rest
  .put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.TESTSERVER_ID), { body: testcommands })
  .then((data) => console.log(`Successfully registered ${data.length} application test commands.`))
  .catch(console.error);

rest
  .put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
