require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const testcommands = [];
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    if (command.test) {
      testcommands.push(command.data.toJSON());
    } else {
      commands.push(command.data.toJSON());
    }
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST().setToken(process.env.LOGIN_TOKEN);

rest
  .put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.TESTSERVER_ID), { body: testcommands })
  .then((data) => console.log(`Successfully registered ${data.length} application test commands.`))
  .catch(console.error);

rest
  .put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
