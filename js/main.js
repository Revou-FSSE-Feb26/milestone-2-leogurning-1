// LeonFun Main JS for Homepage interactions and animations

import { showModal } from "./utils.js";

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

/* ─── Scroll-reveal animations ────────────────────────────────── */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));

/* ─── Contact Form ────────────────────────────────────────────── */
const contactForm = document.getElementById("contact-form");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("c-name").value.trim();
  const email = document.getElementById("c-email").value.trim();
  const message = document.getElementById("c-message").value.trim();

  // Validation — empty check
  if (!name || !email || !message) {
    showModal(
      "Fields Required",
      "All fields must be filled in. Please complete your name, email, and message before sending.",
      "error",
    );
    return;
  }

  // Basic email format check
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    showModal("Invalid Email", "Please enter a valid email address.", "error");
    return;
  }

  // All good — log and confirm
  console.log("LeonFun Contact Submission:", { name, email, message });
  showModal(
    "Message Received! 🎉",
    `Thank you, ${name}! LeonFun has received your message and will get back to you at ${email} soon.`,
    "success",
  );
  contactForm.reset();
});

// Footer year auto-update
document.getElementById("year").textContent = new Date().getFullYear();
