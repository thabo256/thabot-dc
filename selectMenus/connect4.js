const { MessageFlags, userMention } = require('discord.js');

const getBoard = options => {
  const board = [];
  for (const option of options) {
    board.push(option.label === '-' ? [] : option.label.split(' '));
  }
  return board;
};

const printBoard = (board, col) => {
  let out = '`';
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < board.length; j++) {
      out = out + '┃' + (board[j][5 - i] ?? '⚫');
    }
    out = out + '┃`\n`';
  }
  let numbers = ' 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ `';
  if (col !== undefined) {
    numbers = numbers.substring(0, (col + 1) * 4 - 3) + '🔺' + numbers.substring((col + 1) * 4);
  }
  return out + numbers;
};

const equals4 = (a, b, c, d) => {
  return a === b && b === c && c === d;
};

module.exports = {
  name: 'connect4',
  async execute(interaction, ids) {
    if (ids[1] === 'start') {
      if (interaction.message.mentions.users.size > 1) {
        // opponent has been declared in command
        // check if not a player
        if (!interaction.message.mentions.users.has(interaction.user.id)) {
          return interaction.reply({ content: 'you are not in the game\nuse `/connect4` to start a new game', flags: MessageFlags.Ephemeral });
        }
      }
      const content = interaction.message.content;
      const components = interaction.message.components;
      const column = parseInt(interaction.values[0]);

      const board = getBoard(components[0].components[0].options);

      // get players
      const regex = /<@!?(\d+?)>(..?) /g;
      const players = [regex.exec(content), regex.exec(content)];
      if (!players[1]) {
        if (players[0][1] === interaction.user.id) {
          // player who created the game plays first; opponent can still be anyone
          components[0].components[0].data.custom_id = 'connect4-join';

          components[0].components[0].options[column].label = players[0][2];
          board[column].push(players[0][2]);

          return interaction.update({ content: `${userMention(players[0][1])}${players[0][2]} is playing connect4\n\n${printBoard(board, column)}`, components });
        }
        players[1] = ['', interaction.user.id, players[0][2] === '🔴' ? '🟡' : '🔴'];
      }
      const startingPlayer = players[0][1] === interaction.user.id ? 0 : 1;

      components[0].components[0].data.custom_id = 'connect4-select';

      const option = components[0].components[0].options[column];
      option.label = players[startingPlayer][2];

      board[column].push(players[startingPlayer][2]);

      const heading = `${userMention(players[0][1])}${players[0][2]} **vs** ${userMention(players[1][1])}${players[1][2]} \n\n${userMention(players[(startingPlayer + 1) % 2][1])}'s Turn\n\n`;

      await interaction.update({ content: heading + printBoard(board, column), components });
    } else if (ids[1] === 'join') {
      // join after the starting player has played their first move
      // check if it's the starting player
      if (interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.deferUpdate();
      }

      const content = interaction.message.content;
      const components = interaction.message.components;
      const column = parseInt(interaction.values[0]);

      const board = getBoard(components[0].components[0].options);

      // get players
      const regex = /<@!?(\d+?)>(..?) /g;
      const players = [regex.exec(content)];
      players.push(['', interaction.user.id, players[0][2] === '🔴' ? '🟡' : '🔴']);

      components[0].components[0].data.custom_id = 'connect4-select';

      const option = components[0].components[0].options[column];
      if (option.label === '-') {
        option.label = players[1][2];
      } else {
        option.label = option.label + players[1][2];
      }

      board[column].push(players[1][2]);

      const heading = `${userMention(players[0][1])}${players[0][2]} **vs** ${userMention(players[1][1])}${players[1][2]} \n\n${userMention(players[0][1])}'s Turn\n\n`;

      await interaction.update({ content: heading + printBoard(board, column), components });
    } else if (ids[1] === 'select') {
      // normal move
      // not a player
      if (!interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.reply({ content: 'you are not in the game\nuse `/connect4` to start a new game', flags: MessageFlags.Ephemeral });
      }

      const content = interaction.message.content;

      // wrong player
      if (interaction.user.id !== content.match(/<@!?(\d+?)>'s Turn/)[1]) return interaction.deferUpdate();

      const components = interaction.message.components;
      const column = parseInt(interaction.values[0]);

      const board = getBoard(components[0].components[0].options);

      // prevent out of bounds
      if (board[column].length > 6) {
        return interaction.deferUpdate();
      }

      // get players
      const regex = /<@!?(\d+?)>(..?) /g;
      const players = [regex.exec(content), regex.exec(content)];
      const playingPlayer = players[0][1] === interaction.user.id ? 0 : 1;

      const option = components[0].components[0].options[column];
      if (option.label === '-') {
        option.label = players[playingPlayer][2];
      } else {
        option.label = option.label + ' ' + players[playingPlayer][2];
      }

      board[column].push(players[playingPlayer][2]);

      // win detection
      const lines = [];
      // vertical
      for (const [coli, col] of board.entries()) {
        for (let i = 0; i < 6 - 3; i++) {
          if (col[i + 3] && equals4(col[i], col[i + 1], col[i + 2], col[i + 3])) {
            lines.push([coli, i], [coli, i + 1], [coli, i + 2], [coli, i + 3]);
          }
        }
      }
      // horizontal
      for (let i = 0; i < board.length - 3; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (equals4(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) {
            lines.push([i, j], [i + 1, j], [i + 2, j], [i + 3, j]);
          }
        }
      }
      // diagonal /
      for (let i = 0; i < board.length - 3; i++) {
        for (let j = 0; j < 6 - 3; j++) {
          if (board[i][j] && equals4(board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3])) {
            lines.push([i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3]);
          }
        }
      }
      // diagonal \
      for (let i = 3; i < board.length; i++) {
        for (let j = 0; j < 6 - 3; j++) {
          if (board[i][j] && equals4(board[i][j], board[i - 1][j + 1], board[i - 2][j + 2], board[i - 3][j + 3])) {
            lines.push([i, j], [i - 1, j + 1], [i - 2, j + 2], [i - 3, j + 3]);
          }
        }
      }
      if (lines.length > 0) {
        // get winner
        const color = board[lines[0][0]][lines[0][1]];
        const winner = players[0][2] === color ? players[0][1] : players[1][1];
        const squares = {
          '🔴': '🟥',
          '🟡': '🟨',
          '🟠': '🟧',
          '🟤': '🟫',
          '🟣': '🟪',
          '🔵': '🟦',
          '🟢': '🟩',
          '⚪': '⬜',
        };
        const square = squares[color];
        for (const spot of lines) {
          board[spot[0]][spot[1]] = square;
        }
        const heading = `${userMention(players[0][1])}${players[0][2]} **vs** ${userMention(players[1][1])}${players[1][2]} \n\n${userMention(winner)} won\n\n`;
        components = [];
        return interaction.update({ content: heading + printBoard(board), components });
      }

      const heading = `${userMention(players[0][1])}${players[0][2]} **vs** ${userMention(players[1][1])}${players[1][2]} \n\n${userMention(players[(playingPlayer + 1) % 2][1])}'s Turn\n\n`;

      await interaction.update({ content: heading + printBoard(board, column), components });
    }
  },
};
