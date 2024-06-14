import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../@types/command";
import { CommandTypes } from "../../@types/enums";
import { getLeaderboard, getUserRank } from "../../utils/picoctf";

let command: Command = {
  type: CommandTypes.SlashCommand,
  data: new SlashCommandBuilder()
    .setName("picoctf-rank")
    .setDescription("picoCTF rank for a user")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the score for")
        .setRequired(true)
    ),
  execute: async (_client, interaction) => {
    let user = interaction.options.getString("user") as string;

    const leaderboard = await getLeaderboard();
    const userRank = await getUserRank(user, leaderboard);

    await interaction.deferReply();

    const { username, id } = interaction.user;

    let leaderboardEmbed = new EmbedBuilder()
      .setTitle("** Top 5 picoCTF leaderboard **")
      .setColor(0x00ff00)
      .setFooter({
        text: `Requested by ${username}`,
      });

    leaderboardEmbed.setDescription(
      `${1}. ${userRank.username} - ${userRank.score} points`
    );

    await interaction.editReply({
      embeds: [leaderboardEmbed],
    });

    return true;
  },
};

export default command;
