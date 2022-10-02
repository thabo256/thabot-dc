module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const m = message.content.toLowerCase();
    if (m === 'ping') {
      await message.react('🇵');
      await message.react('🇮');
      await message.react('🇳');
      await message.react('🇬');
    } else if (m.includes('gute nacht')) {
      await message.channel.send('┏━━┳┓┏┳━━┳━┓┏━┳┳━━┳━┳┓┏┳━━┓\n┃┏━┫┃┃┣┓┏┫╺┫┃┃┃┃╺╸┃┏┫┗┛┣┓┏┛\n┃┗╸┃┗┛┃┃┃┃╺┫┃┃┃┃┏┓┃┗┫┏┓┃┃┃\n┗━━┻━━┛┗┛┗━┛┗┻━┻┛┗┻━┻┛┗┛┗┛');
    }
  },
};
