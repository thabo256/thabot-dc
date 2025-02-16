const { SlashCommandBuilder, EmbedBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('suggest a new feature for the bot')
    .addStringOption((option) => option.setName('suggestion').setDescription('your suggestion').setRequired(true).setMaxLength(1000))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
    try {
    const invite = await interaction.channel.createInvite();
    const embed = new EmbedBuilder()
      .setColor(0xffff00)
      .setTitle(interaction.guild.name)
      .setURL(invite.url)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
      .setDescription(suggestion)
      .setThumbnail(interaction.guild.iconURL())
      .setTimestamp();
    await interaction.client.users.cache.find((user) => user.id === process.env.DEVELOPER_ID).send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setDescription(suggestion)
        .setTimestamp();
      await interaction.client.users.cache.find((user) => user.id === process.env.DEVELOPER_ID).send({ embeds: [embed] });
    }
    await interaction.reply({ content: `your suggestion will be processed shortly`, flags: MessageFlags.Ephemeral });
  },
};
