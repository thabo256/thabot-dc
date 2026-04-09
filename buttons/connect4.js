const { MessageFlags, ModalBuilder, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  name: 'connect4',
  async execute(interaction, ids) {
    if (ids[1] === 'color') {
      // check if not a player
      if (!interaction.message.mentions.users.has(interaction.user.id)) {
        return interaction.reply({ content: 'you are not in the game\nuse `/connect4` to start a new game', flags: MessageFlags.Ephemeral });
      }
      const colors = {
        '🔴': 'red',
        '🟡': 'yellow',
        '🟠': 'orange',
        '🟤': 'brown',
        '🟣': 'purple',
        '🔵': 'blue',
        '🟢': 'green',
        '⚪': 'white',
      };
      // get players
      const content = interaction.message.content;
      const regex = /<@!?(\d+?)>(..?) /g;
      const players = [regex.exec(content), regex.exec(content)];
      if (players[1]) {
        const opponent = players[0][1] === interaction.user.id ? 1 : 0;
        delete colors[players[opponent][2]];
      }
      await interaction.showModal(new ModalBuilder().setCustomId('connect4-color').setTitle('change color').addLabelComponents(
        new LabelBuilder().setLabel('select a new color').setStringSelectMenuComponent(
          new StringSelectMenuBuilder().setCustomId('connect4-color').setPlaceholder('select a new color').setRequired(true).addOptions(
            ...Object.entries(colors).map(([key, value]) => new StringSelectMenuOptionBuilder().setLabel(value).setValue(value).setEmoji(key)),
          )
        )
      ))
    }
  },
};
