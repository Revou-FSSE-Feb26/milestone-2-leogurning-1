// guess.js — Number Guessing Game (ES Module)

// Importing utility functions for showing modals, saving scores, and rendering the leaderboard
import { saveScore, renderLeaderboard, showModal } from "./utils.js";

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
  /**
   * If valid, save the nickname, update the display, hide the nickname section, show the game section,
   * render the leaderboard with the current nickname highlighted, and start a new round.
   */
  nickname = name;
  nickDisplay.textContent = nickname;
  nicknameSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
  newRound();
});

// Allow pressing Enter in the nickname input to start the game as well for better UX.
nickInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

/* ─── Submit guess ───────────────────────────────────────────── */
submitBtn?.addEventListener("click", makeGuess);
guessInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") makeGuess();
});

// Allow clicking the "New Round" button to start a new game after finishing a round.
document.getElementById("new-round-btn")?.addEventListener("click", newRound);

/* ─── New round ──────────────────────────────────────────────── */
function newRound() {
  // Generate a new random target number between MIN and MAX, reset attempts and game state.
  target = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  attemptsLeft = MAX_ATTEMPTS;
  gameActive = true;

  // Reset the input fields, enable them, and set focus for the next round.
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  guessInput.focus();

  // Reset the hint.
  hintEl.textContent = `Guess a number between ${MIN} and ${MAX}`;
  hintEl.className = "font-body text-gray-500 text-lg my-2";

  // Update the attempts display and clear the guess history for the new round.
  attemptsEl.textContent = attemptsLeft;
  historyEl.innerHTML = "";

  // Hide the round result message until the round is over.
  roundResultEl.classList.add("hidden");

  // Update the score display with the current total wins and update the attempts bar.
  updateBar();
}

/* ─── Core guess logic ───────────────────────────────────────── */
function makeGuess() {
  // If the game is not active (e.g., after winning or losing), ignore guess submissions until a new round is started.
  if (!gameActive) return;

  // Validate the guess input: it must be a whole number between MIN and MAX. If invalid, show an error modal.
  const raw = guessInput.value.trim();
  const guess = parseInt(raw, 10);

  if (!raw || isNaN(guess) || guess < MIN || guess > MAX) {
    showModal(
      "Invalid Number",
      `Please enter a whole number between ${MIN} and ${MAX}.`,
      "error",
    );
    return;
  }

  /**
   * Valid guess number — decrement attempts, add to history,
   * update display, and check for win/loss conditions.
   */
  attemptsLeft--;
  addHistory(guess, guess < target ? "low" : guess > target ? "high" : "exact");
  attemptsEl.textContent = attemptsLeft;
  updateBar();
  guessInput.value = "";

  /**
   * Check if the guess is correct.
   * If so, increment total wins, save the score, update the leaderboard,
   * show a success hint, and end the round with a win message.
   */
  if (guess === target) {
    totalWins++;
    scoreEl.textContent = totalWins;
    saveScore(GAME_KEY, nickname, totalWins);
    renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);

    setHint(`🎉 Correct! The number was ${target}!`, "text-green-600");
    endRound("🎉 You guessed it! Play another round?");
    return;
  }

  /**
   * If the guess is incorrect and there are no attempts left,
   * show a failure hint and end the round with a loss message.
   */
  if (attemptsLeft === 0) {
    setHint(`💔 Out of tries! The number was ${target}.`, "text-red-500");
    endRound("😢 Better luck next time! Try again?");
    return;
  }

  /**
   * If the guess is incorrect but there are still attempts left,
   * show a hint indicating whether the guess was too low or too high.
   */
  if (guess < target) {
    setHint("📈 Too Low! Go higher.", "text-blue-500");
  } else {
    setHint("📉 Too High! Go lower.", "text-orange-500");
  }

  guessInput.focus();
}

/* ─── Helpers ────────────────────────────────────────────────── */
function setHint(text, colorClass) {
  // Set hint content and style
  hintEl.textContent = text;
  hintEl.className = `font-display text-xl my-2 ${colorClass}`;
}

/**
 * Add guess number history function
 * @param {*} guess
 * @param {*} type
 */
function addHistory(guess, type) {
  // Construct parent span element and style to display the guess history
  const span = document.createElement("span");
  const styles = {
    low: "bg-blue-100 text-blue-700",
    high: "bg-red-100 text-red-600",
    exact: "bg-green-100 text-green-700 font-bold",
  };

  // Define the low, high, exact icons type and define the guess number history content element and style
  const icons = { low: "↑", high: "↓", exact: "✓" };
  span.className = `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-body font-semibold ${styles[type]}`;
  span.textContent = `${icons[type]} ${guess}`;

  // append the element to the parent span
  historyEl.appendChild(span);
}

/**
 * Function to Update attempt bar section
 */
function updateBar() {
  // Check if the attemp bar element exist
  if (!attBar) return;

  // If exists, check the attempts left and update the bar content and set the style
  const pct = (attemptsLeft / MAX_ATTEMPTS) * 100;
  attBar.style.width = pct + "%";
  attBar.className = `h-2 rounded-full transition-all duration-500 ${
    pct > 60 ? "bg-green-400" : pct > 30 ? "bg-yellow-400" : "bg-red-400"
  }`;
}

/**
 * Function end game round
 * @param {*} msg
 */
function endRound(msg) {
  // Set game inactive, disable guess input and submit button after the game round finished
  gameActive = false;
  guessInput.disabled = true;
  submitBtn.disabled = true;

  // Set and Display the game round result message
  roundResultEl.textContent = msg;
  roundResultEl.classList.remove("hidden");
}

// Instructions Reveal Toggle of Game Instructions
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
