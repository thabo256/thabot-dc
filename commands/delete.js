const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('deletes last sent messages in channel')
    .addNumberOption((option) => option.setName('count').setDescription('number of messages to delete')),
  async execute(interaction) {
    const count = Math.floor(interaction.options.getNumber('count')) ?? 1;
    if (count > 100) {
      return interaction.reply({ content: `${count} is too much! Please enter a number lower than 100!`, ephemeral: true });
    } else if (count < 1) {
      return interaction.reply({ content: `can't delete ${count} messages!`, ephemeral: true });
    }
    if (count == 1) {
      await interaction.reply({ content: `deleting last message`, ephemeral: true });
    } else {
      await interaction.reply({ content: `deleting last ${count} messages`, ephemeral: true });
    }

    await interaction.channel.messages
      .fetch({ limit: count })
      .then((messages) => {
        interaction.channel.bulkDelete(messages);
      })
      .catch(console.error);
  },
};
