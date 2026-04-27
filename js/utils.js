// utils.js — Shared Utilities (ES Module)

/**
 * Inject a modal overlay into the page.
 * @param {string} title
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 */
export function showModal(title, message, type = "info") {
  document.getElementById("lf-modal")?.remove();
  //Define the modal type (success, error, or info) and corresponding styles and icons
  const icon = type === "success" ? "🎉" : type === "error" ? "⚠️" : "ℹ️";

  // Define the color palette for each modal type, including border, background, title text, and button styles.
  const palette = {
    success: {
      wrap: "border-green-300 bg-green-50",
      title: "text-green-700",
      btn: "bg-green-400 hover:bg-green-500",
    },
    error: {
      wrap: "border-red-300 bg-red-50",
      title: "text-red-600",
      btn: "bg-red-400 hover:bg-red-500",
    },
    info: {
      wrap: "border-purple-300 bg-purple-50",
      title: "text-purple-700",
      btn: "bg-purple-400 hover:bg-purple-500",
    },
  };
  const p = palette[type] ?? palette.info;

  /**
   * Create the modal overlay element with the appropriate structure and styles based on the type, then append it to the body.
   * The modal includes an icon, title, message, and an "OK" button to close it. Clicking outside the modal card also closes it.
   */
  const overlay = document.createElement("div");
  overlay.id = "lf-modal";
  overlay.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm";
  overlay.innerHTML = `
    <div class="modal-card border-2 ${p.wrap} rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
      <div class="text-5xl mb-3 select-none">${icon}</div>
      <h3 class="font-display text-2xl ${p.title} mb-2">${title}</h3>
      <p class="font-body text-gray-600 mb-6 leading-relaxed">${message}</p>
      <button id="lf-modal-ok"
        class="${p.btn} text-white font-bold font-body py-2 px-10 rounded-full transition-colors duration-200 cursor-pointer">
        OK
      </button>
    </div>`;
  document.body.appendChild(overlay);

  // Add event listeners to close the modal when the button is clicked or when clicking outside the card
  const close = () => overlay.remove();
  document.getElementById("lf-modal-ok").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

/**
 * Retrieve all scores for a game from localStorage.
 * @param {string} gameKey
 * @returns {Array<{nickname:string, score:number, date:string}>}
 */
export function getScores(gameKey) {
  // Retrieve the scores for the specified game from localStorage, return empty array if not found or on error
  try {
    const raw = localStorage.getItem(`leonfun_${gameKey}_scores`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save (or update) a player's best score for a game.
 * Only replaces the existing entry when the new score is strictly higher.
 * @param {string} gameKey
 * @param {string} nickname
 * @param {number} score
 * @returns {Array} sorted scores array
 */
export function saveScore(gameKey, nickname, score) {
  // Get existing scores, find if the player already has a score, and update or add the entry accordingly.
  const scores = getScores(gameKey);
  console.log("Name:", nickname, "Score:", score);
  const idx = scores.findIndex(
    (s) => s.nickname.toLowerCase() === nickname.toLowerCase(),
  );

  // If the player already has a score, only update it if the new score is higher. Otherwise, add a new entry.
  if (idx !== -1) {
    if (score > scores[idx].score) {
      scores[idx].score = score;
      scores[idx].date = new Date().toLocaleDateString();
    }
  } else {
    scores.push({
      nickname,
      score,
      date: new Date().toLocaleDateString(),
    });
  }

  // Sort the scores in descending order and save back to localStorage, then return the sorted array.
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(`leonfun_${gameKey}_scores`, JSON.stringify(scores));
  return scores;
}

/**
 * Return the top N scores for a game, sorted highest-first.
 * @param {string} gameKey
 * @param {number} [limit=10]
 */
export function getTopScores(gameKey, limit = 10) {
  // Get all scores for the game, sort them in descending order, and return only the top 'limit' entries.
  return getScores(gameKey)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Render the leaderboard table inside a container element.
 * @param {string} gameKey
 * @param {string} containerId
 * @param {string} [currentNickname='']
 */
export function renderLeaderboard(gameKey, containerId, currentNickname = "") {
  // Get the container element by ID, if it doesn't exist, exit early.
  const container = document.getElementById(containerId);
  if (!container) return;

  // Get the top scores for the game. If there are no scores, display a friendly message and exit.
  const scores = getTopScores(gameKey);
  if (!scores.length) {
    container.innerHTML = `
      <p class="text-center text-gray-400 font-body py-6 text-sm">
        🎮 No scores yet — be the first champion!
      </p>`;
    return;
  }

  // Define the medal emojis for the top three positions.
  const medals = ["🥇", "🥈", "🥉"];

  /**
   * Build the HTML for each score entry, highlighting the current player's entry if it exists, and inject it into the container.
   * Also includes the player's rank (medal or #), nickname, score, and date. The nickname is escaped to prevent XSS.
   */
  container.innerHTML = scores
    .map((s, i) => {
      const isCurrent =
        s.nickname.toLowerCase() === currentNickname.toLowerCase();
      return `
      <div class="flex items-center justify-between px-4 py-2 rounded-xl mb-2
        ${isCurrent ? "bg-yellow-50 border-2 border-yellow-300 shadow-sm" : "bg-white border border-gray-100 shadow-sm"}
        transition-all duration-200">
        <div class="flex items-center gap-3">
          <span class="text-xl w-7 text-center">${medals[i] ?? `#${i + 1}`}</span>
          <span class="font-body font-bold text-gray-700 truncate max-w-[120px]
            ${isCurrent ? "text-yellow-700" : ""}">${escapeHtml(s.nickname)}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-display text-lg text-purple-600">${s.score.toLocaleString()}</span>
          <span class="text-xs text-gray-400 font-body">${s.date}</span>
        </div>
      </div>`;
    })
    .join("");
}

/** Prevent XSS in user-supplied strings. */
export function escapeHtml(str) {
  // Convert special characters to HTML entities to prevent XSS attacks when rendering user-supplied strings in the DOM.
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
