module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const m = message.content.toLowerCase();
    if (m === 'ping') {
      await message.react('šµ');
      await message.react('š®');
      await message.react('š³');
      await message.react('š¬');
    } else if (m.includes('gute nacht')) {
      await message.channel.send('āāāā³āāā³āāā³āāāāā³ā³āāā³āā³āāā³āāā\nāāāā«āāā£āāā«āŗā«āāāāāŗāøāāā«āāā£āāā\nāāāøāāāāāāāāŗā«āāāāāāāāā«āāāāā\nāāāā»āāāāāāāāāā»āā»āāā»āā»āāāāā');
    }
  },
};
