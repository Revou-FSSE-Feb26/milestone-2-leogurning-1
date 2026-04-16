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
