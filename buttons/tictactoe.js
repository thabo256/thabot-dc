const { userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
  name: 'tictactoe',
  async execute(interaction, ids) {
    if (ids[1] === 'join') {
      const user = interaction.message.mentions.users.first();
      if (user.id === interaction.user.id) {
        return interaction.reply({ content: "you can't play against yourself\ngo and find friends!", flags: MessageFlags.Ephemeral });
      }

      // build board
      const board = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-0-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-0-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-0-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-1-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-1-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-1-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-2-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-2-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-2-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
      ];

      // send bord
      return interaction.update({ content: `${userMention(user.id)}\`X\` **vs** ${userMention(interaction.user.id)}\`O\`\n\nanyone click to start`, components: board });

      
    } else if (ids[1] === 'rematch') {
      // not a player
      if (!interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.reply({ content: 'you are not in the game\nuse `/tictactoe` to start a new game', flags: MessageFlags.Ephemeral });
      }
      const content = interaction.message.content;
      const components = interaction.message.components;
      const button = components[3].components[0];
      // get players
      const regex = /<@!?(\d+?)>`.+?`/g;
      const players = [regex.exec(content), regex.exec(content)];
      if (players[0][1] !== interaction.user.id) {
        players.reverse();
      }
      button.data.label = 'accept rematch';
      button.data.custom_id = `tictactoe-accept-${players[1][1]}`;

      // send rematch request
      return interaction.update({ content, components });
    } else if (ids[1] === 'accept') {
      if (ids[2] !== interaction.user.id) return interaction.deferUpdate();
      const content = interaction.message.content;
      const components = interaction.message.components;
      components.pop();
      await interaction.update({ components });

      // get players
      const regex = /<@!?(\d+?)>`(.+?)`/g;
      const players = [regex.exec(content), regex.exec(content)];

      // choose starting player
      let line2 = `${userMention(players[0][1])}'s turn`;
      if (/draw/.test(content)) {
        line2 = 'anyone click to start';
      } else if (players[0][1] === content.match(/<@!?(\d+?)> won/)[1]) {
        line2 = `${userMention(players[1][1])}'s turn`;
      }

      // build board
      const board = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-0-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-0-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-0-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-1-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-1-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-1-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('tictactoe-2-0').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-2-1').setLabel('-').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('tictactoe-2-2').setLabel('-').setStyle(ButtonStyle.Secondary)
        ),
      ];

      // send new bord
      return interaction.followUp({ content: `${userMention(players[0][1])}\`${players[0][2]}\` **vs** ${userMention(players[1][1])}\`${players[1][2]}\`\n\n${line2}`, components: board });
    } else {
      // not a player
      if (!interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.reply({ content: 'you are not in the game\nuse `/tictactoe` to start a new game', flags: MessageFlags.Ephemeral });
      }
      const message = interaction.message.content;
      if (!message.includes('anyone click to start')) {
        // wrong player
        if (interaction.user.id !== message.match(/<@!?(\d+?)>'s turn/)[1]) return interaction.deferUpdate();
      }
      // get players
      const regex = /<@!?(\d+?)>`(.+?)`/g;
      const players = [regex.exec(message), regex.exec(message)];
      if (players[0][1] !== interaction.user.id) {
        players.reverse();
      }

      // check valid turn else return
      const components = interaction.message.components;
      const button = components[ids[1]].components[ids[2]];
      if (button.data.label !== '-') return interaction.deferUpdate();
      // update board
      button.data.label = players[0][2];

      const line1 = message.match(/<@!?\d+?>`.+?` \*\*vs\*\* <@!?\d+?>`.+?`/)[0];
      let line2 = '\n\ndraw';

      // check win or draw -> return
      const win = checkWin();
      if (win) {
        line2 = `\n\n${userMention(players[0][1])} won!`;
      }
      if (win || checkDraw()) {
        disableAll();
        // add rematch button
        components.push(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('tictactoe-rematch').setLabel('rematch').setStyle(ButtonStyle.Danger)));
        return interaction.update({ content: line1 + line2, components });
      }

      // next player's turn
      return interaction.update({ content: `${line1}\n\n${userMention(players[1][1])}'s turn`, components });

      // helper functions
      function checkDraw() {
        for (const row of components) {
          for (const btn of row.components) {
            if (btn.label === '-') {
              return false;
            }
          }
        }
        return true;
      }
      function checkWin() {
        if (equals3(ids[1], 0, ids[1], 1, ids[1], 2)) {
          for (let i = 0; i < 3; i++) {
            components[ids[1]].components[i].data.style = 3;
          }
          return true;
        } else if (equals3(0, ids[2], 1, ids[2], 2, ids[2])) {
          for (let i = 0; i < 3; i++) {
            components[i].components[ids[2]].data.style = 3;
          }
          return true;
        } else if (equals3(0, 0, 1, 1, 2, 2)) {
          for (let i = 0; i < 3; i++) {
            components[i].components[i].data.style = 3;
          }
          return true;
        } else if (equals3(0, 2, 1, 1, 2, 0)) {
          for (let i = 0; i < 3; i++) {
            components[i].components[2 - i].data.style = 3;
          }
          return true;
        }
        return false;
      }
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
          components[y0].components[x0].data.label !== '-'
        );
      }
    }
  },
};
