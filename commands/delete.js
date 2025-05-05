const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('deletes last sent messages in channel')
    .addNumberOption(option => option.setName('count').setDescription('number of messages to delete').setMinValue(1).setMaxValue(100))
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
  test: true,
  async execute(interaction) {
    const count = interaction.options.getNumber('count') ?? 1;
    if (count === 1) {
      await interaction.reply({ content: `deleting last message`, flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: `deleting last ${count} messages`, flags: MessageFlags.Ephemeral });
    }

    await interaction.channel.messages
      .fetch({ limit: count })
      .then(messages => {
        interaction.channel.bulkDelete(messages);
      })
      .catch(console.error);
  },
};
