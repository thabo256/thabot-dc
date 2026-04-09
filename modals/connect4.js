const { MessageFlags } = require('discord.js');
const connect4 = require('../selectMenus/connect4');

module.exports = {
  name: 'connect4',
  async execute(interaction, ids) {
    if (ids[1] === 'color') {
      // check if not a player
      if (!interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.reply({ content: 'you are not in the game\nuse `/connect4` to start a new game', flags: MessageFlags.Ephemeral });
      }
      const color = interaction.fields.getStringSelectValues('connect4-color');
      const colors = {
        red: '🔴',
        yellow: '🟡',
        orange: '🟠',
        brown: '🟤',
        purple: '🟣',
        blue: '🔵',
        green: '🟢',
        white: '⚪',
      };
      // get players
      const content = interaction.message.content;
      const regex = /<@!?(\d+?)>(..?) /g;
      const players = [regex.exec(content), regex.exec(content)];
      if (players[1]) {
        const opponent = players[0][1] === interaction.user.id ? 1 : 0;
        if (players[opponent][2] === colors[color]) {
          return interaction.deferReply();
        }
      }
      const currentColor = players[0][1] === interaction.user.id ? players[0][2] : players[1][2];
      const message = content.replaceAll(currentColor, colors[color]);
      const components = interaction.message.components;
      for (const option of components[0].components[0].options) {
        option.label = option.label.replaceAll(currentColor, colors[color]);
      }

      await interaction.update({ content: message, components });
    }
  },
};
