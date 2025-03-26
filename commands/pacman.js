const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pacman')
    .setDescription('play pacman')
    .addUserOption((option) => option.setName('user').setDescription('player of pacman'))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  test: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;

    const components = [
      new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('pacman-0').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true), new ButtonBuilder().setCustomId('pacman-up').setLabel('⬆️').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('pacman-2').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)),
      new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('pacman-left').setLabel('⬅️').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('pacman-4').setLabel('🔵').setStyle(ButtonStyle.Secondary).setDisabled(true), new ButtonBuilder().setCustomId('pacman-right').setLabel('➡️').setStyle(ButtonStyle.Secondary)),
      new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('pacman-6').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true), new ButtonBuilder().setCustomId('pacman-down').setLabel('⬇️').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('pacman-8').setLabel('▪️').setStyle(ButtonStyle.Secondary).setDisabled(true)),
    ];

    const board = new PacmanBoard();
    const pacman = new PacmanCharacter(27, 46);
    board.addCharacter(pacman);

    console.log(pacman.getDirections());

    await interaction.reply(`${userMention(user.id)}'s game of pacman\n\`\`\`\n${board.toString()}\n\`\`\``);
    await interaction.followUp({ content: userMention(user.id), components });
  },
};

class PacmanCharacter {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction ?? 'left';
  }

  move() {
    switch (this.direction) {
      case 'up':
        this.y -= 1;
        break;
      case 'down':
        this.y += 1;
        break;
      case 'left':
        this.x -= 1;
        break;
      case 'right':
        this.x += 1;
        break;
    }
  }

  getDirections() {
    const board = {
      2: { 2: 12, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 14, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 10, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 6, 30: 12, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 10, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 14, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 6 },
      3: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      4: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      5: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      6: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      7: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      8: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      9: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      10: { 2: 13, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 15, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 14, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 11, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 11, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 14, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 15, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 7 },
      11: { 2: 5, 12: 5, 18: 5, 36: 5, 42: 5, 52: 5 },
      12: { 2: 5, 12: 5, 18: 5, 36: 5, 42: 5, 52: 5 },
      13: { 2: 5, 12: 5, 18: 5, 36: 5, 42: 5, 52: 5 },
      14: { 2: 5, 12: 5, 18: 5, 36: 5, 42: 5, 52: 5 },
      15: { 2: 5, 12: 5, 18: 5, 36: 5, 42: 5, 52: 5 },
      16: { 2: 9, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 7, 18: 9, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 6, 30: 12, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 3, 42: 13, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 3 },
      17: { 12: 5, 24: 5, 30: 5, 42: 5 },
      18: { 12: 5, 24: 5, 30: 5, 42: 5 },
      19: { 12: 5, 24: 5, 30: 5, 42: 5 },
      20: { 12: 5, 24: 5, 30: 5, 42: 5 },
      21: { 12: 5, 24: 5, 30: 5, 42: 5 },
      22: { 12: 5, 18: 12, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 11, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 11, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 6, 42: 10 },
      23: { 12: 5, 18: 5, 36: 5, 42: 5 },
      24: { 12: 5, 18: 5, 36: 5, 42: 5 },
      25: { 12: 5, 18: 5, 36: 5, 42: 5 },
      26: { 12: 5, 18: 5, 36: 5, 42: 5 },
      27: { 12: 5, 18: 5, 36: 5, 42: 5 },
      28: { 0: 10, 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 15, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 7, 36: 13, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 15, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 10, 53: 10, 54: 10 },
      19: { 12: 5, 18: 5, 36: 5, 42: 5 },
      30: { 12: 5, 18: 5, 36: 5, 42: 5 },
      31: { 12: 5, 18: 5, 36: 5, 42: 5 },
      32: { 12: 5, 18: 5, 36: 5, 42: 5 },
      33: { 12: 5, 18: 5, 36: 5, 42: 5 },
      34: { 12: 5, 18: 13, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 10, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 10, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 7, 42: 5 },
      35: { 12: 5, 18: 5, 36: 5, 42: 5 },
      36: { 12: 5, 18: 5, 36: 5, 42: 5 },
      37: { 12: 5, 18: 5, 36: 5, 42: 5 },
      38: { 12: 5, 18: 5, 36: 5, 42: 5 },
      39: { 12: 5, 18: 5, 36: 5, 42: 5 },
      40: { 2: 12, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 14, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 10, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 6, 30: 12, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 10, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 14, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 6 },
      41: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      42: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      43: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      44: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      45: { 2: 5, 12: 5, 24: 5, 30: 5, 42: 5, 52: 5 },
      46: { 2: 9, 3: 10, 4: 10, 5: 10, 6: 6, 12: 13, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 14, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 11, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 11, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 14, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 7, 48: 12, 49: 10, 50: 10, 51: 10, 52: 3 },
      47: { 6: 5, 12: 5, 18: 5, 36: 5, 42: 5, 48: 5 },
      48: { 6: 5, 12: 5, 18: 5, 36: 5, 42: 5, 48: 5 },
      49: { 6: 5, 12: 5, 18: 5, 36: 5, 42: 5, 48: 5 },
      50: { 6: 5, 12: 5, 18: 5, 36: 5, 42: 5, 48: 5 },
      51: { 6: 5, 12: 5, 18: 5, 36: 5, 42: 5, 48: 5 },
      52: { 2: 12, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 3, 18: 9, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 6, 30: 12, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 3, 42: 9, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 6 },
      53: { 2: 5, 24: 5, 30: 5, 52: 5 },
      54: { 2: 5, 24: 5, 30: 5, 52: 5 },
      55: { 2: 5, 24: 5, 30: 5, 52: 5 },
      56: { 2: 5, 24: 5, 30: 5, 52: 5 },
      57: { 2: 5, 24: 5, 30: 5, 52: 5 },
      58: { 2: 9, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 10, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 10, 19: 10, 20: 10, 21: 10, 22: 10, 23: 10, 24: 11, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 11, 31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 10, 37: 10, 38: 10, 39: 10, 40: 10, 41: 10, 42: 10, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51: 10, 52: 3 },
    };
    const directions = {
      1: ['up'],
      2: ['left'],
      3: ['up', 'left'],
      4: ['down'],
      5: ['up', 'down'],
      6: ['left', 'down'],
      7: ['up', 'left', 'down'],
      8: ['right'],
      9: ['up', 'right'],
      10: ['left', 'right'],
      11: ['up', 'left', 'right'],
      12: ['down', 'right'],
      13: ['up', 'down', 'right'],
      14: ['left', 'down', 'right'],
      15: ['up', 'left', 'down', 'right'],
    };
    return directions[board[this.y][this.x]];
  }
}

class PacmanBoard {
  constructor() {
    this.board = [
      '╭─────────────────────────╮ ╭─────────────────────────╮\n',
      '│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n',
      '│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n',
      '│ ● │     │ • │       │ • │ │ • │       │ • │     │ ● │\n',
      '│ • ╰─────╯ • ╰───────╯ • ╰─╯ • ╰───────╯ • ╰─────╯ • │\n',
      '│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n',
      '│ • ╭─────╮ • ╭─╮ • ╭─────────────╮ • ╭─╮ • ╭─────╮ • │\n',
      '│ • ╰─────╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─────╯ • │\n',
      '│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n',
      '╰─────────╮ • │ ╰─────╮   │ │   ╭─────╯ │ • ╭─────────╯\n',
      '          │ • │ ╭─────╯   ╰─╯   ╰─────╮ │ • │          \n',
      '          │ • │ │                     │ │ • │          \n',
      '          │ • │ │   ╔═════───═════╗   │ │ • │          \n',
      '──────────╯ • ╰─╯   ║             ║   ╰─╯ • ╰──────────\n',
      '            •       ║             ║       •            \n',
      '──────────╮ • ╭─╮   ║             ║   ╭─╮ • ╭──────────\n',
      '          │ • │ │   ╚═════════════╝   │ │ • │          \n',
      '          │ • │ │                     │ │ • │          \n',
      '          │ • │ │   ╭─────────────╮   │ │ • │          \n',
      '╭─────────╯ • ╰─╯   ╰─────╮ ╭─────╯   ╰─╯ • ╰─────────╮\n',
      '│ • • • • • • • • • • • • │ │ • • • • • • • • • • • • │\n',
      '│ • ╭─────╮ • ╭───────╮ • │ │ • ╭───────╮ • ╭─────╮ • │\n',
      '│ • ╰───╮ │ • ╰───────╯ • ╰─╯ • ╰───────╯ • │ ╭───╯ • │\n',
      '│ ● • • │ │ • • • • • • •     • • • • • • • │ │ • • ● │\n',
      '╰───╮ • │ │ • ╭─╮ • ╭─────────────╮ • ╭─╮ • │ │ • ╭───╯\n',
      '╭───╯ • ╰─╯ • │ │ • ╰─────╮ ╭─────╯ • │ │ • ╰─╯ • ╰───╮\n',
      '│ • • • • • • │ │ • • • • │ │ • • • • │ │ • • • • • • │\n',
      '│ • ╭─────────╯ ╰─────╮ • │ │ • ╭─────╯ ╰─────────╮ • │\n',
      '│ • ╰─────────────────╯ • ╰─╯ • ╰─────────────────╯ • │\n',
      '│ • • • • • • • • • • • • • • • • • • • • • • • • • • │\n',
      '╰─────────────────────────────────────────────────────╯',
    ];
  }

  addPacman(x, y) {
    if (y % 2 === 0) {
      this.insert(y / 2, (x + 54) % 55, '▐');
      this.insert(y / 2, x % 55, '█');
      this.insert(y / 2, (x + 1) % 55, '▌');
    } else {
      this.insert((y - 1) / 2, (x + 54) % 55, '▗');
      this.insert((y - 1) / 2, x % 55, '▄');
      this.insert((y - 1) / 2, (x + 1) % 55, '▖');
      this.insert((y + 1) / 2, (x + 54) % 55, '▝');
      this.insert((y + 1) / 2, x % 55, '▀');
      this.insert((y + 1) / 2, (x + 1) % 55, '▘');
    }
  }

  addCharacter(character) {
    if (!(character instanceof PacmanCharacter)) {
      throw new TypeError('c must be a PacmanCharacter');
    }
    const x = character.x;
    const y = character.y;

    if (y % 2 === 0) {
      this.insert(y / 2, (x + 54) % 55, '▐');
      this.insert(y / 2, x % 55, '█');
      this.insert(y / 2, (x + 1) % 55, '▌');
    } else {
      this.insert((y - 1) / 2, (x + 54) % 55, '▗');
      this.insert((y - 1) / 2, x % 55, '▄');
      this.insert((y - 1) / 2, (x + 1) % 55, '▖');
      this.insert((y + 1) / 2, (x + 54) % 55, '▝');
      this.insert((y + 1) / 2, x % 55, '▀');
      this.insert((y + 1) / 2, (x + 1) % 55, '▘');
    }
  }

  insert(row, col, value) {
    this.board[row] = this.board[row].substring(0, col) + value + this.board[row].substring(col + 1);
  }

  toString() {
    return this.board.join('');
  }
}
