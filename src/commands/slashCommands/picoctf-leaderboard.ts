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
    .setName("picoctf-leaderboard")
    .setDescription("picoCTF leaderboard")
    .setDMPermission(false),

  execute: async (_client, interaction) => {
    const leaderboard = await getLeaderboard();

    await interaction.deferReply();

    const { username, id } = interaction.user;

    let leaderboardEmbed = new EmbedBuilder()
      .setTitle("** PicoCTF leaderboard **")
      .setColor(0x00ff00)
      .setFooter({
        text: `Requested by ${username}`,
      });
    console.log(leaderboard.length);

    leaderboardEmbed.setDescription(
      leaderboard
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
