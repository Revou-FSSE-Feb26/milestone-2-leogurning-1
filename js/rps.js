import { saveScore, renderLeaderboard, showModal } from "./utils.js";

/* ─── Constants ──────────────────────────────────────────────── */
const GAME_KEY = "rps";
const CHOICES = ["rock", "paper", "scissors"];
const EMOJI = { rock: "🪨", paper: "📄", scissors: "✂️" };
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };

/* ─── State ──────────────────────────────────────────────────── */
let nickname = "";
let wins = 0;
let losses = 0;
let draws = 0;

/* ─── DOM refs ───────────────────────────────────────────────── */
const nicknameSection = document.getElementById("nickname-section");
const gameSection = document.getElementById("game-section");
const nickInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const drawsEl = document.getElementById("draws");
const playerEmojiEl = document.getElementById("player-emoji");
const cpuEmojiEl = document.getElementById("cpu-emoji");
const resultEl = document.getElementById("result-text");
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
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
});

nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

/* ─── Choice buttons ─────────────────────────────────────────── */
document.querySelectorAll(".rps-btn").forEach((btn) => {
  btn.addEventListener("click", () => playRPSGame(btn.dataset.choice));
});

/* ─── Core rps logic ────────────────────────────────────────── */
function playRPSGame(playerChoice) {
  const cpuChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

  // Animate: show spinning question mark then reveal
  playerEmojiEl.textContent = "❓";
  cpuEmojiEl.textContent = "❓";

  setTimeout(() => {
    playerEmojiEl.textContent = EMOJI[playerChoice];
    cpuEmojiEl.textContent = EMOJI[cpuChoice];
    playerEmojiEl.classList.add("pop-in");
    cpuEmojiEl.classList.add("pop-in");
    setTimeout(() => {
      playerEmojiEl.classList.remove("pop-in");
      cpuEmojiEl.classList.remove("pop-in");
    }, 400);
  }, 300);

  const outcome = getRPSOutcome(playerChoice, cpuChoice);

  if (outcome === "win") {
    wins++;
    setResult(`🎉 You Win!`, "text-green-600");
  } else if (outcome === "lose") {
    losses++;
    setResult(`😢 CPU Wins!`, "text-red-500");
  } else {
    draws++;
    setResult(`🤝 It's a Draw!`, "text-yellow-600");
  }

  winsEl.textContent = wins;
  lossesEl.textContent = losses;
  drawsEl.textContent = draws;

  // Save best wins tally
  saveScore(GAME_KEY, nickname, wins);
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
}

function getRPSOutcome(player, cpu) {
  if (player === cpu) return "draw";
  return BEATS[player] === cpu ? "win" : "lose";
}

function setResult(text, colorClass) {
  resultEl.textContent = text;
  resultEl.className = `font-display text-3xl my-3 transition-all ${colorClass}`;
}

/* ─── Reset button ───────────────────────────────────────────── */
document.getElementById("reset-btn")?.addEventListener("click", () => {
  wins = 0;
  losses = 0;
  draws = 0;
  winsEl.textContent = 0;
  lossesEl.textContent = 0;
  drawsEl.textContent = 0;
  playerEmojiEl.textContent = "❓";
  cpuEmojiEl.textContent = "❓";
  resultEl.textContent = "Pick your move!";
  resultEl.className = "font-display text-2xl my-3 text-gray-400";
});

// Instructions Reveal Toggle
const toggle = document.getElementById("instructions-toggle");
const body = document.getElementById("instructions-body");
const chev = document.getElementById("instructions-chevron");
toggle.addEventListener("click", () => {
  const open = body.style.maxHeight !== "0px" && body.style.maxHeight !== "";
  body.style.maxHeight = open ? "0" : body.scrollHeight + "px";
  chev.style.transform = open ? "rotate(0deg)" : "rotate(180deg)";
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
