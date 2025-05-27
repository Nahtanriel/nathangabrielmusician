let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling down
    navbar.style.top = "-40px"; 
    // Close hamburger menu if open
    if (hamburger.classList.contains("open") || navLinks.classList.contains("active")) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("active");
    }
  } else {
    // Scrolling up
    navbar.style.top = "0"; // Show navbar
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.about-image-slider .fade-image');
  let currentIndex = 0;
  const fadeDuration = 1000; // 1 second
  const displayDuration = 4000; // 4 seconds

  images[currentIndex].classList.add('active');

  setInterval(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    images[nextIndex].classList.add('active');

    setTimeout(() => {
      images[currentIndex].classList.remove('active');
      currentIndex = nextIndex;
    }, fadeDuration);

  }, displayDuration);
});

const modal = document.getElementById("bookingModal");
const formContainer = document.getElementById("formContainer");
const toggleBtn = document.getElementById("toggleBookingModal");
const closeBtn = document.getElementById("closeModalBtn");

const imageTriggers = [
  'images/acoustic.jpg',
  'images/largesound.jpg',
  'images/busking.jpg'
];

let isModalOpen = false;
let formLoaded = false;
let lastFocusedElement = null;  // To save where focus was before opening modal

function openModal() {
  lastFocusedElement = document.activeElement; // Save focus

  modal.style.display = "block";
  isModalOpen = true;
  toggleBtn.textContent = "×";

  if (!formLoaded) {
    const iframe = document.createElement("iframe");
    iframe.src = "https://form.jotform.com/251430610711038";
    iframe.title = "Booking Form";
    iframe.width = "100%";
    iframe.height = "700";
    iframe.style.border = "none";
    iframe.allowFullscreen = true;

    formContainer.innerHTML = "";
    formContainer.appendChild(iframe);
    formLoaded = true;
  }

 
  const currentScrollY = window.scrollY || window.pageYOffset;
  window.scrollTo(0, currentScrollY - 1); // Scroll 1px up instantly

  modal.scrollIntoView({ behavior: "smooth", block: "start" });

  document.body.classList.add("modal-open");

  trapFocus(modal);
}


function closeModal() {
  modal.style.display = "none";
  isModalOpen = false;
  toggleBtn.textContent = "☰";

  document.body.classList.remove("modal-open");


  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}


function getFocusableElements(container) {
  return container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
  );
}


function trapFocus(element) {
  const focusableElements = getFocusableElements(element);
  if (focusableElements.length === 0) {
    element.setAttribute('tabindex', '-1');
    element.focus();
    return;
  }

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  firstFocusable.focus();

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  }

  element.addEventListener("keydown", handleKeyDown);

  
  function cleanup() {
    element.removeEventListener("keydown", handleKeyDown);
    element.removeEventListener("transitionend", cleanup);
  }
  element.addEventListener("transitionend", cleanup);
}

document.querySelectorAll(".service-card img").forEach(img => {
  if (imageTriggers.includes(img.getAttribute("src"))) {
    img.style.cursor = "pointer";
    img.addEventListener("click", openModal);
  }
});


toggleBtn.addEventListener("click", () => {
  if (isModalOpen) {
    closeModal();
  } else {
    openModal();
  }
});


window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

