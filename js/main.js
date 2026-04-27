// LeonFun Main JS for Homepage interactions and animations
// Importing the showModal function from utils.js to display modal dialogs for user feedback
import { showModal } from "./utils.js";

/* ─── Navigation ─────────────────────────────────────────────── */
const navToggle = document.getElementById("nav-toggle");
const navMobile = document.getElementById("nav-mobile");

// Toggle mobile nav visibility when the hamburger icon is clicked
navToggle?.addEventListener("click", () => {
  navMobile?.classList.toggle("hidden");
});

// Close mobile nav when a link is clicked
navMobile?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navMobile.classList.add("hidden"));
});

/* ─── Navbar scroll shadow ────────────────────────────────────── */
const navbar = document.getElementById("navbar");

/**
 * Add a shadow and background to the navbar when scrolling down for better visibility,
 * and remove it when at the top of the page.
 */
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
  /**
   * For each anchor link that points to an ID on the page,
   * add a click event listener that smoothly scrolls to the target section instead of jumping directly.
   * Also close the mobile nav if it's open.
   */
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navMobile?.classList.add("hidden");
  });
});

/**
 * Scroll-reveal animations
 * Use the Intersection Observer API to add a "revealed" class to elements with the "scroll-reveal" class when they come into view, triggering CSS animations.
 * Each element is observed only once for performance. The threshold and root margin are set to trigger the reveal slightly before the element is fully in view.
 */
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
// Observe all elements with the "scroll-reveal" class for the scroll-reveal animation effect.
document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));

/* ─── Contact Form ────────────────────────────────────────────── */
const contactForm = document.getElementById("contact-form");

/**
 * Handle contact form submission with validation and user feedback. When the form is submitted, prevent the default behavior and validate the input fields.
 */
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
