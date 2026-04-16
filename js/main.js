/* ─── Navigation ─────────────────────────────────────────────── */
const navToggle = document.getElementById("nav-toggle");
const navMobile = document.getElementById("nav-mobile");

navToggle?.addEventListener("click", () => {
  navMobile?.classList.toggle("hidden");
});

// Close mobile nav when a link is clicked
navMobile?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navMobile.classList.add("hidden"));
});

/* ─── Navbar scroll shadow ────────────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add("shadow-lg", "bg-white/95", "backdrop-blur");
  } else {
    navbar.classList.remove("shadow-lg", "bg-white/95", "backdrop-blur");
  }
});

/* ─── Smooth Scroll ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navMobile?.classList.add("hidden");
  });
});
