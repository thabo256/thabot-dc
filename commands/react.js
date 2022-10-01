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
    .setName('react')
    .setDescription('react to latest message')
    .addStringOption((option) => option.setName('text').setDescription('text to react (max. 20 characters)').setRequired(true)),
  test: true,
  async execute(interaction) {
    const text = interaction.options.getString('text');
    if (text.length > 20) return interaction.reply({ content: 'your text is too long', ephemeral: true });
    if (/(.).*\1/.test(text)) return interaction.reply({ content: `${text} has repeated characters`, ephemeral: true });
    const message = interaction.channel.lastMessage;
    if (message === null) return interaction.reply({ content: "can't find last message", ephemeral: true });
    await interaction.reply({ content: `reacting with ${text}`, ephemeral: true });
    for (const char of text.toLowerCase()) {
      const emoji = emojis[char];
      if (emoji) {
        await message.react(emoji);
      }
    }
  },
};
