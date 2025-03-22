const { ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
  name: 'pacman',
  async execute(interaction, ids) {
    if (interaction.message.mentions.users.first().id !== interaction.user.id) {
      return interaction.reply({ content: 'you are not in the game\nuse `/pacman` to start a new game', flags: MessageFlags.Ephemeral });
    }

    const content = interaction.message.content;
    const components = interaction.message.components;
    if (ids[1] === 'right') {
      components[0].components[1].data.style = ButtonStyle.Secondary;
      components[1].components[0].data.style = ButtonStyle.Secondary;
      components[1].components[2].data.style = ButtonStyle.Success;
      components[2].components[1].data.style = ButtonStyle.Secondary;
      interaction.update({ content, components });
    } else if (ids[1] === 'left') {
      components[0].components[1].data.style = ButtonStyle.Secondary;
      components[1].components[0].data.style = ButtonStyle.Success;
      components[1].components[2].data.style = ButtonStyle.Secondary;
      components[2].components[1].data.style = ButtonStyle.Secondary;
      interaction.update({ content, components });
    } else if (ids[1] === 'up') {
      components[0].components[1].data.style = ButtonStyle.Success;
      components[1].components[0].data.style = ButtonStyle.Secondary;
      components[1].components[2].data.style = ButtonStyle.Secondary;
      components[2].components[1].data.style = ButtonStyle.Secondary;
      interaction.update({ content, components });
    } else if (ids[1] === 'down') {
      components[0].components[1].data.style = ButtonStyle.Secondary;
      components[1].components[0].data.style = ButtonStyle.Secondary;
      components[1].components[2].data.style = ButtonStyle.Secondary;
      components[2].components[1].data.style = ButtonStyle.Success;
      interaction.update({ content, components });
    }
  },
};
