import axios from "axios";
import { parse } from "csv-parse";
import fs from "fs";
import "dotenv/config";

async function login() {
  const response = await axios
    .post(
      "https://play.picoctf.org/api/user/login/",
      {
        username: process.env.picoctf_username,
        password: process.env.picoctf_password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/",
          "Cache-Control": "no-cache",
        },
      }
    )
    .catch((err) => err.response);

  const { data, headers } = response;

  const authCookies = headers["set-cookie"]
    ?.map((cookie: string) => cookie.split(";")[0])
    .join("; ");

  return authCookies;
}
interface GetMembersOptions {
  isLeader: boolean;
}

async function getMembers(Cookie: string, { isLeader }: GetMembersOptions) {
  const response = await axios.get(
    `https://play.picoctf.org/api/classroom_members/?classroom=7798&pending=false&page_size=50&leader=${isLeader}&event=gym`,
    {
      headers: {
        Cookie,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/",
        "Cache-Control": "no-cache",
      },
    }
  );

  const { data } = response;
  return data.results;
}

export async function getLeaderboard() {
  try {
    const authCookies = await login();

    const members = await getMembers(authCookies, { isLeader: false });
    const leaders = await getMembers(authCookies, { isLeader: true });

    const leaderboard = [...leaders, ...members];

    leaderboard.sort((a, b) => b.score - a.score);

    return leaderboard;
  } catch (error) {
    const leaderboard = await getLeaderboardFromCsv(
      "./src/utils/csv/picoctf.csv"
    );
    return leaderboard;
  }
}
interface Leaderboard {
  username: string;
  score: number;
}
export function getLeaderboardFromCsv(csvPath: string): Promise<Leaderboard[]> {
  return new Promise((resolve, reject) => {
    let leaderboard: Leaderboard[] = [];
    fs.createReadStream(csvPath)
      .pipe(parse({ delimiter: "," }))
      .on("data", function (row: string[]) {
        console.log(`${row[0]} => ${row[row.length - 1]}`);
        leaderboard.push({
          username: row[0],
          score: parseInt(row[row.length - 1]),
        });
      })
      .on("end", () => {
        resolve(leaderboard);
      });
  });
}

export async function getUserRank(username: string, leaderboard: any[]) {
  const user = leaderboard.find((member) => member.username === username);

  if (!user) {
    return null;
  }

  return user;
}
