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
  'images/acoustic-intimate.jpg',
  'images/large-sound.jpg',
  'images/busking-market.jpg'
];

let isModalOpen = false;
let formLoaded = false; 

function openModal() {
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
  
  // Scroll smoothly to the modal after opening
  modal.scrollIntoView({ behavior: "smooth", block: "start" });
  
  // Optional: add a class to prevent background scroll when modal is open
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.style.display = "none";
  isModalOpen = false;
  toggleBtn.textContent = "OPEN BOOKING FORM";

  // Optional: remove class to re-enable scroll on body
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".service-card img").forEach(img => {
  if (imageTriggers.includes(img.getAttribute("src"))) {
    img.style.cursor = "pointer";
    img.addEventListener("click", openModal);
  }
});

// Toggle button click
toggleBtn.addEventListener("click", () => {
  if (isModalOpen) {
    closeModal();
  } else {
    openModal();
  }
});

// Close modal if user clicks outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

