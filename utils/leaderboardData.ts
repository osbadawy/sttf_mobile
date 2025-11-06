// features/leaderboard/data.ts
import { LBPlayer } from "./ledearboardTypes";

export const DATA: LBPlayer[] = [
  {
    id: "p1",
    name: "Player 1",
    score: 2400,
    avatar: "https://i.pravatar.cc/120?img=11",
    trend: "same",
  },
  {
    id: "p2",
    name: "Player 2",
    score: 2000,
    avatar: "https://i.pravatar.cc/120?img=12",
    trend: "up",
  },
  {
    id: "p3",
    name: "Player 3",
    score: 1900,
    avatar: "https://i.pravatar.cc/120?img=13",
    trend: "down",
  },
  {
    id: "p4",
    name: "Player 4",
    score: 1800,
    avatar: "https://i.pravatar.cc/120?img=14",
    trend: "up",
  },
  {
    id: "p5",
    name: "Player 5",
    score: 1700,
    avatar: "https://i.pravatar.cc/120?img=15",
    trend: "same",
  },
  {
    id: "p6",
    name: "Player 6",
    score: 1600,
    avatar: "https://i.pravatar.cc/120?img=16",
    trend: "up",
  },
  {
    id: "you",
    name: "You",
    score: 1500,
    avatar: "https://i.pravatar.cc/120?img=17",
    trend: "down",
    isYou: true,
  },
  {
    id: "p8",
    name: "Player 8",
    score: 1000,
    avatar: "https://i.pravatar.cc/120?img=18",
    trend: "same",
  },
];
