const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
  '!': '❗',
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
    .addStringOption((option) => option.setName('text').setDescription('text to react').setRequired(true).setMaxLength(20)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    if (/(.).*\1/.test(text)) return interaction.reply({ content: `${text} has repeated characters`, flags: MessageFlags.Ephemeral });
    const message = interaction.channel.lastMessage;
    if (message === null) return interaction.reply({ content: "can't find last message", flags: MessageFlags.Ephemeral });
    await interaction.reply({ content: `reacting with ${text}`, flags: MessageFlags.Ephemeral });
    for (const char of text.toLowerCase()) {
      const emoji = emojis[char];
      if (emoji) {
        await message.react(emoji);
      }
    }
  },
};
