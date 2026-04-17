// guess.js — Number Guessing Game (ES Module)
import { showModal } from "./utils.js";

/* ─── Constants ──────────────────────────────────────────────── */
const GAME_KEY = "guess";
const MIN = 1;
const MAX = 100;
const MAX_ATTEMPTS = 5;

/* ─── State ──────────────────────────────────────────────────── */
let nickname = "";
let target = 0;
let attemptsLeft = MAX_ATTEMPTS;
let gameActive = false;
let totalWins = 0;

/* ─── DOM refs ───────────────────────────────────────────────── */
const nicknameSection = document.getElementById("nickname-section");
const gameSection = document.getElementById("game-section");
const nickInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const hintEl = document.getElementById("hint");
const attemptsEl = document.getElementById("attempts-left");
const historyEl = document.getElementById("guess-history");
const attBar = document.getElementById("attempts-bar");
const roundResultEl = document.getElementById("round-result");
const scoreEl = document.getElementById("score-display");
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
  newRound();
});

nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

/* ─── New round ──────────────────────────────────────────────── */
function newRound() {
  target = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  attemptsLeft = MAX_ATTEMPTS;
  gameActive = true;

  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  guessInput.focus();

  hintEl.textContent = `Guess a number between ${MIN} and ${MAX}`;
  hintEl.className = "font-body text-gray-500 text-lg my-2";

  attemptsEl.textContent = attemptsLeft;
  historyEl.innerHTML = "";
  roundResultEl.classList.add("hidden");
  updateBar();
}
/* ─── Helpers ────────────────────────────────────────────────── */
function setHint(text, colorClass) {
  hintEl.textContent = text;
  hintEl.className = `font-display text-xl my-2 ${colorClass}`;
}

function updateBar() {
  if (!attBar) return;
  const pct = (attemptsLeft / MAX_ATTEMPTS) * 100;
  attBar.style.width = pct + "%";
  attBar.className = `h-2 rounded-full transition-all duration-500 ${
    pct > 60 ? "bg-green-400" : pct > 30 ? "bg-yellow-400" : "bg-red-400"
  }`;
}

// Instructions Reveal Toggle
const toggle = document.getElementById("instructions-toggle");
const body = document.getElementById("instructions-body");
const chev = document.getElementById("instructions-chevron");
toggle?.addEventListener("click", () => {
  const open = body.style.maxHeight !== "0px" && body.style.maxHeight !== "";
  body.style.maxHeight = open ? "0" : body.scrollHeight + "px";
  chev.style.transform = open ? "rotate(0deg)" : "rotate(180deg)";
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
