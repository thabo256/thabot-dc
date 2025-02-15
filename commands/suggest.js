const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('suggest a new feature for the bot')
    .addStringOption((option) => option.setName('suggestion').setDescription('your suggestion').setRequired(true).setMaxLength(1000)),
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
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
    await interaction.reply({ content: `your suggestion will be processed shortly`, flags: MessageFlags.Ephemeral });
  },
};
