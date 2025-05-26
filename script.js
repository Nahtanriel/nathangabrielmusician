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
