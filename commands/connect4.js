const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags, userMention, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const colors = {
  red: '🔴',
  yellow: '🟡',
  orange: '🟠',
  brown: '🟤',
  purple: '🟣',
  blue: '🔵',
  green: '🟢',
  white: '⚪',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('connect4')
    .setDescription('Play connect4')
    .addUserOption(option => option.setName('opponent').setDescription('user to play against'))
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('the color you want to play as (default red)')
        .addChoices(...Object.entries(colors).map(([key, value]) => ({ name: value + ' ' + key, value: key }))),
    )
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  async execute(interaction) {
    const opponent = interaction.options.getUser('opponent');
    const color = interaction.options.getString('color') ?? 'red';

    if (opponent && interaction.user.id === opponent.id) {
      return interaction.reply({ content: "you can't play against yourself\ngo and find friends!", flags: MessageFlags.Ephemeral });
    }

    const board = '`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n`┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃⚫┃`\n` 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ `';

    const components = [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('connect4-start')
          .setPlaceholder('select a column to play')
          .addOptions(
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('0').setEmoji('1️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('1').setEmoji('2️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('2').setEmoji('3️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('3').setEmoji('4️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('4').setEmoji('5️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('5').setEmoji('6️⃣'),
            new StringSelectMenuOptionBuilder().setLabel('-').setValue('6').setEmoji('7️⃣'),
          ),
      ),
    ];

    if (opponent) {
      await interaction.reply({ content: `${userMention(interaction.user.id)}${colors[color]} **vs** ${userMention(opponent.id)}${color === 'red' ? '🟡' : '🔴'} \n\n${board}`, components });
    } else {
      await interaction.reply({ content: `${userMention(interaction.user.id)}${colors[color]} is playing connect4\n\n${board}`, components });
    }
  },
};
