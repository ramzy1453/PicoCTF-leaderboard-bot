import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../@types/command";
import { CommandTypes } from "../../@types/enums";
import { getLeaderboard } from "../../utils/picoctf";

let command: Command = {
  type: CommandTypes.SlashCommand,
  data: new SlashCommandBuilder()
    .setName("picoctf-leaderboard-top5")
    .setDescription("picoCTF leaderboard top 5")
    .setDMPermission(false),

  execute: async (_client, interaction) => {
    const leaderboard = await getLeaderboard();

    console.log(leaderboard);

    await interaction.deferReply();

    const { username, id } = interaction.user;

    let leaderboardEmbed = new EmbedBuilder()
      .setTitle("** Top 5 picoCTF leaderboard **")
      .setColor(0x00ff00)
      .setFooter({
        text: `Requested by ${username}`,
      });

    leaderboardEmbed.setDescription(
      leaderboard
        .slice(0, 5)
        .map(
          (member, index) =>
            `${index + 1}. ${member.username} - ${member.score} points`
        )
        .join("\n")
    );

    await interaction.editReply({
      embeds: [leaderboardEmbed],
    });

    return true;
  },
};

export default command;
