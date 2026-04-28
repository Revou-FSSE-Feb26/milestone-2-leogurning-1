// avoid.js — Avoid the Falling Objects Game (ES Module)

// Importing utility functions for showing modals, saving scores, and rendering the leaderboard
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

/* ─── Show game area ────────────────────────────────────────── */
document.getElementById("play-btn")?.addEventListener("click", showGameArea);
document.getElementById("restart-btn")?.addEventListener("click", showGameArea);

function showGameArea() {
  const gameArea = document.getElementById("game-area");
  gameArea.style.display = "block";
  gameArea.classList.remove("hidden");
}

/* ─── Start / Restart Game ──────────────────────────────────── */
document.getElementById("play-btn")?.addEventListener("click", startGame);
document.getElementById("restart-btn")?.addEventListener("click", startGame);

/**
 * Starts a new game by resetting the state, clearing any existing falling objects, and kicking off the game loop.
 */
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

/**
 * The main game loop function that updates the game state and renders the game.
 * @param {number} ts - The current timestamp.
 * @returns {void}
 */
function loop(ts) {
  // If the game is not active (e.g., after a collision), stop the loop.
  if (!gameActive) return;

  // Calculate time delta since last frame for smooth movement and spawning
  const delta = ts - lastTs;
  lastTs = ts;

  // Move player based on input, ensuring they stay within the game area bounds (0% to 100%)
  if (moveLeft) playerX = Math.max(1, playerX - PLAYER_SPEED * (delta / 16.67));
  if (moveRight)
    playerX = Math.min(92, playerX + PLAYER_SPEED * (delta / 16.67));
  playerEl.style.left = playerX + "%";

  // Update score (tenths of a second survived)
  score = Math.floor((ts - startTs) / 100);
  scoreEl.textContent = score;

  // Spawn new objects at intervals that decrease over time to increase difficulty, while also increasing the falling speed.
  if (ts - lastSpawnTs >= spawnInterval) {
    spawnObject();
    lastSpawnTs = ts;
    spawnInterval = Math.max(MIN_SPAWN_MS, spawnInterval - 14);
    currentSpeed = Math.min(MAX_SPEED, currentSpeed + 0.07);
  }

  // Set up the game area, falling objects, and player rectangles for collision detection.
  const areaH = gameAreaEl.clientHeight;
  const areaRect = gameAreaEl.getBoundingClientRect();
  const playerRect = playerEl.getBoundingClientRect();

  // Initialize hit flag to track if any collision occurs during this frame
  let hit = false;

  // Loop backwards through falling objects to allow safe removal while iterating
  for (let i = fallingObjs.length - 1; i >= 0; i--) {
    // Move object down based on current speed and time delta
    const obj = fallingObjs[i];
    obj.y += currentSpeed * (delta / 16.67);
    obj.el.style.top = obj.y + "px";

    // If the object has moved beyond the bottom of the game area, remove it from the DOM and the array
    if (obj.y > areaH + 20) {
      obj.el.remove();
      fallingObjs.splice(i, 1);
      continue;
    }

    // Simplified AABB collision with a slight inset for forgiveness
    const or = obj.el.getBoundingClientRect();
    const inset = 7; // pixels of inset to make the game more forgiving

    // Check if the player's rectangle (with inset) overlaps with the object's rectangle (with inset). If so, set hit flag to true.
    if (
      playerRect.left + inset < or.right - inset &&
      playerRect.right - inset > or.left + inset &&
      playerRect.top + inset < or.bottom - inset &&
      playerRect.bottom - inset > or.top + inset
    ) {
      hit = true;
    }
  }

  // If a collision was detected with any object, end the game.
  if (hit) {
    endGame();
    return;
  }
  // Request the next animation frame to continue the game loop.
  animFrame = requestAnimationFrame(loop);
}

/**
 * Spawn helper function ─────────────────────────────────────────────
 * Spawns a new falling object at a random horizontal position at the top of the game area with a random symbol from the FALL_OBJECTS array, and adds it to the DOM and the fallingObjs array for tracking.
 * @returns {void}
 */
function spawnObject() {
  // Create a new div element for the falling object.
  const el = document.createElement("div");
  // Randomly determine the horizontal position (xPct) between 3% and 90% to avoid spawning too close to the edges.
  const xPct = 3 + Math.random() * 87;

  // Randomly select a symbol from the FALL_OBJECTS array to use as the content of the falling object.
  const symbol = FALL_OBJECTS[Math.floor(Math.random() * FALL_OBJECTS.length)];

  // Set the class and initial styles for the falling object, position it at the top of the game area, and add it to the DOM.
  el.className =
    "fall-obj absolute text-3xl select-none pointer-events-none leading-none";
  el.style.left = xPct + "%";
  el.style.top = "-48px";
  el.textContent = symbol;
  gameAreaEl.appendChild(el);

  // Add the new falling object to the fallingObjs array with its element reference and initial y position for tracking in the game loop.
  fallingObjs.push({ el, y: -48 });
}

/**
 * End game function ─────────────────────────────────────────────────
 * Ends the game by setting the game as inactive, canceling the animation frame, displaying the final score, showing the game over screen, saving the score to localStorage, and re-rendering the leaderboard to reflect any changes in rankings.
 * @returns {void}
 */
function endGame() {
  // Set game as inactive and cancel the animation frame to stop the game loop.
  gameActive = false;
  cancelAnimationFrame(animFrame);

  // Display the final score on the game over screen and show the game over screen.
  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");

  // Save score to localStorage and re-render the leaderboard to reflect any changes in rankings.
  saveScore(GAME_KEY, nickname, score);
  renderLeaderboard(GAME_KEY, "leaderboard-list", nickname);
}

/**
 * Handles keyboard input for player movement. Pressing the left arrow key or 'A' key will set the moveLeft flag to true, while pressing the right arrow key or 'D' key will set the moveRight flag to true. Releasing any of these keys will reset the corresponding flags to false, allowing for responsive player movement in the game loop.
 * @param {KeyboardEvent} e - The keyboard event triggered by key presses and releases. The function listens for specific keys (ArrowLeft, ArrowRight, A, D) to control the player's movement left and right.
 */
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

/**
 * Binds touch events to a button for mobile controls.
 * When the button is pressed (touchstart), it sets the corresponding movement flag to true and the opposite flag to false.
 * When the touch ends (touchend) or is canceled (mouseleave), it resets both movement flags to false.
 * This allows for responsive touch controls for moving left and right in the game on mobile devices.
 * @param {string} id - The ID of the button element to bind the touch events to.
 * @param {function} setLeft - A function that sets the moveLeft flag when called with a boolean value.
 * @param {function} setRight - A function that sets the moveRight flag when called with a boolean value.
 * @returns {void}
 */
function bindBtn(id, setLeft, setRight) {
  // Get the button element by ID. If it doesn't exist, return early to avoid errors.
  const el = document.getElementById(id);
  if (!el) return;

  // Add event listeners for mouse and touch events to handle setting the movement flags appropriately based on user input.
  el.addEventListener("mousedown", () => {
    // On mouse down, set the corresponding movement flag to true and the opposite flag to false to start moving in the desired direction.
    setLeft(true);
    setRight(false);
  });
  el.addEventListener("mouseup", () => {
    // On mouse up, reset both movement flags to false to stop movement when the button is released.
    setLeft(false);
    setRight(false);
  });
  el.addEventListener("mouseleave", () => {
    // On mouse leave, also reset both movement flags to false to ensure the player stops moving if the cursor leaves the button area.
    setLeft(false);
    setRight(false);
  });
  el.addEventListener(
    "touchstart",
    (e) => {
      // On touch start, set the corresponding movement flag to true and the opposite flag to false to start moving in the desired direction.
      e.preventDefault();
      setLeft(true);
      setRight(false);
    },
    { passive: false },
  );
  el.addEventListener("touchend", () => {
    // On touch end, reset both movement flags to false to stop movement when the touch is released.
    setLeft(false);
    setRight(false);
  });
}

// Bind the left and right buttons for mobile controls using the bindBtn helper function, passing in the appropriate IDs and functions to set the movement flags.
bindBtn(
  "btn-left",
  (v) => (moveLeft = v),
  (v) => (moveRight = v),
);
bindBtn(
  "btn-right",
  (v) => (moveRight = v),
  (v) => (moveLeft = v),
);

// Game Instructions Reveal Toggle
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
