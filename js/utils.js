// utils.js — Shared Utilities (ES Module)

/**
 * Inject a modal overlay into the page.
 * @param {string} title
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 */
export function showModal(title, message, type = "info") {
  document.getElementById("lf-modal")?.remove();

  const icon = type === "success" ? "🎉" : type === "error" ? "⚠️" : "ℹ️";
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
  const scores = getScores(gameKey);
  console.log("Name:", nickname, "Score:", score);
  const idx = scores.findIndex(
    (s) => s.nickname.toLowerCase() === nickname.toLowerCase(),
  );

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
  const container = document.getElementById(containerId);
  if (!container) return;

  const scores = getTopScores(gameKey);
  if (!scores.length) {
    container.innerHTML = `
      <p class="text-center text-gray-400 font-body py-6 text-sm">
        🎮 No scores yet — be the first champion!
      </p>`;
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
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
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
