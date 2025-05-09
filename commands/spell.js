const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

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
    .setName('spell')
    .setDescription('spell out text using reactions')
    .addStringOption(option => option.setName('text').setDescription('text to spell').setRequired(true).setMaxLength(20))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    if (/(.).*\1/.test(text)) return interaction.reply({ content: `${text} has repeated characters`, flags: MessageFlags.Ephemeral });
    await interaction.reply({ content: `spelling out ${text} with reactions`, flags: MessageFlags.Ephemeral });
    await interaction.channel.send('** **').then(async message => {
      for (const char of text.toLowerCase()) {
        const emoji = emojis[char];
        if (emoji) {
          await message.react(emoji);
        }
      }
    });
  },
};
