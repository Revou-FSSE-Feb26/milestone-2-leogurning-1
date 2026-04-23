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

/* ─── State ──────────────────────────────────────────────────── */
let nickname = "";
let score = 0;
let gameActive = false;
let animFrame = null;

/* ─── DOM refs ───────────────────────────────────────────────── */
const nicknameSection = document.getElementById("nickname-section");
const gameSection = document.getElementById("game-section");
const nickInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const nickDisplay = document.getElementById("nick-display");

/* ─── Nickname gate ──────────────────────────────────────────── */
startBtn?.addEventListener("click", () => {
  const name = nickInput.value.trim();
  if (!name) {
    showModal("Hold on!", "Please enter a nickname to start playing.", "error");
    return;
  }
  nickname = name;
  nickDisplay.textContent = nickname;
  nicknameSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  // Start the game
});

nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
