const { SlashCommandBuilder } = require('discord.js');

const emojis = {
  a: '🇦',
  b: '🇧',
  c: '🇨',
  d: '🇩',
  e: '🇪',
  f: '🇫',
  g: '🇬',
  h: '🇭',
  i: '🇮',
  j: '🇯',
  k: '🇰',
  l: '🇱',
  m: '🇲',
  n: '🇳',
  o: '🇴',
  p: '🇵',
  q: '🇶',
  r: '🇷',
  s: '🇸',
  t: '🇹',
  u: '🇺',
  v: '🇻',
  w: '🇼',
  x: '🇽',
  y: '🇾',
  z: '🇿',
  '#': '#️⃣',
  '*': '*️⃣',
  0: '0️⃣',
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
  6: '6️⃣',
  7: '7️⃣',
  8: '8️⃣',
  9: '9️⃣',
  ' ': '🟦',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spell')
    .setDescription('spell out text using reactions')
    .addStringOption((option) => option.setName('text').setDescription('text to spell (max. 20 characters)').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    if (text.length > 20) return interaction.reply({ content: 'your text is too long', ephemeral: true });
    if (/(.).*\1/.test(text)) return interaction.reply({ content: `${text} has repeated characters`, ephemeral: true });
    await interaction.reply({ content: `spelling out ${text} with reactions`, ephemeral: true });
    await interaction.channel.send('** **').then(async (message) => {
      for (const char of text.toLowerCase()) {
        const emoji = emojis[char];
        if (emoji) {
          await message.react(emoji);
        }
      }
    });
  },
};
