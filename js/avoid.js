// avoid.js — Avoid the Falling Objects Game (ES Module)
import { saveScore, renderLeaderboard, showModal } from "./utils.js";

/* ─── Constants ──────────────────────────────────────────────── */
const GAME_KEY = "avoid";
const FALL_OBJECTS = [
  "⭐",
  "🔥",
  "💎",
  "🍎",
  "🎃",
  "❄️",
  "💥",
  "🎯",
  "🌙",
  "🧨",
  "🪄",
  "🎈",
];
const PLAYER_SPEED = 0.65; // % per 16.67ms frame
const BASE_SPEED = 1.6; // px per frame
const MAX_SPEED = 7;
const INITIAL_SPAWN_MS = 1400;
const MIN_SPAWN_MS = 320;

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
