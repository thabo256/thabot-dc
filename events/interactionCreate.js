const { userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isButton()) {
      const ids = interaction.customId.split('-');
      if (ids[0] === 'tictactoe') {
        if (ids[1] === 'join') {
          const user = interaction.message.mentions.users.first();
          if (user.id === interaction.user.id) {
            return interaction.reply({ content: "you can't play against yourself\ngo and find friends!", ephemeral: true });
          }

          const components = [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('tictactoe-0-0').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-0-1').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-0-2').setLabel(' ').setStyle(ButtonStyle.Secondary)
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('tictactoe-1-0').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-1-1').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-1-2').setLabel(' ').setStyle(ButtonStyle.Secondary)
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('tictactoe-2-0').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-2-1').setLabel(' ').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('tictactoe-2-2').setLabel(' ').setStyle(ButtonStyle.Secondary)
            ),
          ];
          // const line1 = `${userMention(user.id)} **vs** ${userMention(interaction.user.id)}`;
          // const line2 = 'anyone click to start';

          await interaction.update({ content: `${userMention(user.id)}\`X\` **vs** ${userMention(interaction.user.id)}\`O\`\n\nanyone click to start`, components });
        } else {
          if (!interaction.message.mentions.users.has(interaction.user.id)) {
            return interaction.reply({ content: 'you are not in the game\nuse `/tictactoe` to start a new game', ephemeral: true });
          }
          const message = interaction.message.content;
          if (!message.includes('anyone click to start')) {
            if (interaction.user.id !== message.match(/<@!?(\d+?)>'s turn/)[1]) return interaction.deferUpdate();
          }
          const regex = /<@!?(\d+?)>`(.+?)`/g;
          const players = [regex.exec(message), regex.exec(message)];
          if (players[0][1] !== interaction.user.id) {
            players.reverse();
          }

          // check valid turn else return
          let components = interaction.message.components;
          let button = components[ids[1]].components[ids[2]];
          if (button.data.label !== ' ') return interaction.deferUpdate();
          button.data.label = players[0][2];

          const line1 = message.match(/<@!?\d+?>`.+?` \*\*vs\*\* <@!?\d+?>`.+?`/)[0];

          // check win or draw -> return
          let win = false;
          if (equals3(ids[1], 0, ids[1], 1, ids[1], 2)) {
            win = true;
            for (let i = 0; i < 3; i++) {
              components[ids[1]].components[i].data.style = 3;
            }
          } else if (equals3(0, ids[2], 1, ids[2], 2, ids[2])) {
            win = true;
            for (let i = 0; i < 3; i++) {
              components[i].components[ids[2]].data.style = 3;
            }
          } else if (equals3(0, 0, 1, 1, 2, 2)) {
            win = true;
            for (let i = 0; i < 3; i++) {
              components[i].components[i].data.style = 3;
            }
          } else if (equals3(0, 2, 1, 1, 2, 0)) {
            win = true;
            for (let i = 0; i < 3; i++) {
              components[i].components[2 - i].data.style = 3;
            }
          }
          if (win) {
            disableAll();
            return interaction.update({ content: `${line1}\n\n${userMention(players[0][1])} won!`, components });
          }
          let draw = true;
          for (const row of components) {
            for (const btn of row.components) {
              if (btn.label === ' ') {
                draw = false;
              }
            }
          }
          if (draw) {
            disableAll();
            return interaction.update({ content: `${line1}\n\ndraw`, components });
          }

          return interaction.update({ content: `${line1}\n\n${userMention(players[1][1])}'s turn`, components });

          function disableAll() {
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                components[i].components[j].data.disabled = true;
              }
            }
          }
          function equals3(y0, x0, y1, x1, y2, x2) {
            return (
              components[y0].components[x0].data.label === components[y1].components[x1].data.label &&
              components[y1].components[x1].data.label === components[y2].components[x2].data.label &&
              components[y0].components[x0].data.label !== ' '
            );
          }
        }
      }
    }
  },
};
