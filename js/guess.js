// guess.js — Number Guessing Game (ES Module)
import { showModal } from "./utils.js";

/* ─── Constants ──────────────────────────────────────────────── */
const GAME_KEY = "guess";
const MIN = 1;
const MAX = 100;
const MAX_ATTEMPTS = 5;

/* ─── State ──────────────────────────────────────────────────── */
let nickname = "";

/* ─── DOM refs ───────────────────────────────────────────────── */
const nicknameSection = document.getElementById("nickname-section");
const gameSection = document.getElementById("game-section");
const nickInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
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
});

nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
