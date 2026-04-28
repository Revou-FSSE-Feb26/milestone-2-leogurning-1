// rps.js — Rock Paper Scissors Game Logic (ES Module)

// Importing utility functions for showing modals, saving scores, and rendering the leaderboard
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

/** ─── Nickname gate ────────────────────────────────────────────
 * Handle the submission of the nickname and start the game.
 */
startBtn?.addEventListener("click", () => {
  // Validate that the nickname input is not empty. If it is, show an error modal prompting the user to enter a nickname.
  const name = nickInput.value.trim();
  if (!name) {
    showModal("Hold on!", "Please enter a nickname to start playing.", "error");
    return;
  }
  // If valid, save the nickname, update the display, hide the nickname section, show the game section.
  nickname = name;
  nickDisplay.textContent = nickname;
  nicknameSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  // Render the leaderboard with the current nickname highlighted.
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
});

// Allow pressing Enter in the nickname input to start the game as well for better UX.
nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

/* ─── Choice buttons to play the RPS game ──────────────────── */
document.querySelectorAll(".rps-btn").forEach((btn) => {
  btn.addEventListener("click", () => playRPSGame(btn.dataset.choice));
});

/* ─── Core rps logic ────────────────────────────────────────── */
/**
 * Plays the Rock Paper Scissors game with the given player choice.
 * @param {string} playerChoice - The player's choice ("rock", "paper", or "scissors")
 */
function playRPSGame(playerChoice) {
  // Randomly generate CPU choice
  const cpuChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

  // Animate: show spinning question mark then reveal
  playerEmojiEl.textContent = "❓";
  cpuEmojiEl.textContent = "❓";

  // Add a slight delay before showing the choices to enhance the reveal effect
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

  // Determine outcome (win/lose/draw) based on player and CPU choices
  const outcome = getRPSOutcome(playerChoice, cpuChoice);

  // Update scores and display result based on the outcome
  switch (outcome) {
    case "win":
      wins++;
      setResult(`🎉 You Win!`, "text-green-600");
      break;
    case "lose":
      losses++;
      setResult(`😢 CPU Wins!`, "text-red-500");
      break;
    case "draw":
      draws++;
      setResult(`🤝 It's a Draw!`, "text-yellow-600");
      break;
    default:
      console.error("Unexpected outcome:", outcome);
  }

  // Update the score display with the current wins, losses, and draws.
  winsEl.textContent = wins;
  lossesEl.textContent = losses;
  drawsEl.textContent = draws;

  // Save score to localStorage and re-render the leaderboard to reflect any changes in rankings.
  saveScore(GAME_KEY, nickname, wins);
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
}

/**
 * Determines the outcome of a Rock Paper Scissors game based on player and CPU choices.
 * @param {string} player - The player's choice ("rock", "paper", or "scissors")
 * @param {string} cpu - The CPU's choice ("rock", "paper", or "scissors")
 * @returns {string} The outcome ("win", "lose", or "draw")
 */
function getRPSOutcome(player, cpu) {
  if (player === cpu) return "draw";
  return BEATS[player] === cpu ? "win" : "lose";
}

// Helper function to set the result message and color based on the game outcome
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

// Game Instructions Reveal Toggle
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
