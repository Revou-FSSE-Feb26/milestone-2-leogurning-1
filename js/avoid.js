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
let fallingObjs = [];
let playerX = 50; // % from left
let currentSpeed = BASE_SPEED;
let spawnInterval = INITIAL_SPAWN_MS;
let lastSpawnTs = 0;
let startTs = 0;
let lastTs = 0;
let moveLeft = false;
let moveRight = false;

/* ─── DOM refs ───────────────────────────────────────────────── */
const nicknameSection = document.getElementById("nickname-section");
const gameSection = document.getElementById("game-section");
const nickInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
const gameAreaEl = document.getElementById("game-area");
const nickDisplay = document.getElementById("nick-display");
const playerEl = document.getElementById("player");
const scoreEl = document.getElementById("score-display");
const gameOverEl = document.getElementById("game-over-screen");
const finalScoreEl = document.getElementById("final-score");
const preGame = document.getElementById("pre-game");

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

/* ─── Show game area ────────────────────────────────────────── */
document.getElementById("play-btn")?.addEventListener("click", showGameArea);
document.getElementById("restart-btn")?.addEventListener("click", showGameArea);

function showGameArea() {
  const gameArea = document.getElementById("game-area");
  gameArea.style.display = "block";
  gameArea.classList.remove("hidden");
}

/* ─── Start / Restart ────────────────────────────────────────── */
document.getElementById("play-btn")?.addEventListener("click", startGame);
document.getElementById("restart-btn")?.addEventListener("click", startGame);

function startGame() {
  // Reset state
  score = 0;
  playerX = 50;
  currentSpeed = BASE_SPEED;
  spawnInterval = INITIAL_SPAWN_MS;
  moveLeft = false;
  moveRight = false;
  fallingObjs = [];
  gameActive = true;

  // Clear falling objects from DOM
  gameAreaEl.querySelectorAll(".fall-obj").forEach((el) => el.remove());

  // Reset UI
  scoreEl.textContent = "0";
  playerEl.style.left = playerX + "%";
  gameOverEl.classList.add("hidden");
  preGame?.classList.add("hidden");

  // Kick off loop
  cancelAnimationFrame(animFrame);
  startTs = performance.now();
  lastTs = startTs;
  lastSpawnTs = startTs;
  animFrame = requestAnimationFrame(loop);
}

/* ─── Game loop ──────────────────────────────────────────────── */
function loop(ts) {
  if (!gameActive) return;

  const delta = ts - lastTs;
  lastTs = ts;

  // Move player
  if (moveLeft) playerX = Math.max(1, playerX - PLAYER_SPEED * (delta / 16.67));
  if (moveRight)
    playerX = Math.min(92, playerX + PLAYER_SPEED * (delta / 16.67));
  playerEl.style.left = playerX + "%";

  // Update score (tenths of a second survived)
  score = Math.floor((ts - startTs) / 100);
  scoreEl.textContent = score;

  // Spawn new objects
  if (ts - lastSpawnTs >= spawnInterval) {
    spawnObject();
    lastSpawnTs = ts;
    spawnInterval = Math.max(MIN_SPAWN_MS, spawnInterval - 14);
    currentSpeed = Math.min(MAX_SPEED, currentSpeed + 0.07);
  }

  // Move objects + collision
  const areaH = gameAreaEl.clientHeight;
  const areaRect = gameAreaEl.getBoundingClientRect();
  const playerRect = playerEl.getBoundingClientRect();

  let hit = false;
  for (let i = fallingObjs.length - 1; i >= 0; i--) {
    const obj = fallingObjs[i];
    obj.y += currentSpeed * (delta / 16.67);
    obj.el.style.top = obj.y + "px";

    if (obj.y > areaH + 20) {
      obj.el.remove();
      fallingObjs.splice(i, 1);
      continue;
    }

    // Simplified AABB collision with a slight inset for forgiveness
    const or = obj.el.getBoundingClientRect();
    const inset = 10;
    if (
      playerRect.left + inset < or.right - inset &&
      playerRect.right - inset > or.left + inset &&
      playerRect.top + inset < or.bottom - inset &&
      playerRect.bottom - inset > or.top + inset
    ) {
      hit = true;
    }
  }

  if (hit) {
    endGame();
    return;
  }

  animFrame = requestAnimationFrame(loop);
}

/* ─── Spawn helper ───────────────────────────────────────────── */
function spawnObject() {
  const el = document.createElement("div");
  const xPct = 3 + Math.random() * 87;
  const symbol = FALL_OBJECTS[Math.floor(Math.random() * FALL_OBJECTS.length)];
  el.className =
    "fall-obj absolute text-3xl select-none pointer-events-none leading-none";
  el.style.left = xPct + "%";
  el.style.top = "-48px";
  el.textContent = symbol;
  gameAreaEl.appendChild(el);
  fallingObjs.push({ el, y: -48 });
}

/* ─── End game ───────────────────────────────────────────────── */
function endGame() {
  gameActive = false;
  cancelAnimationFrame(animFrame);

  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");
}

/* ─── Keyboard controls ──────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft = true;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
    moveRight = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
    moveRight = false;
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
