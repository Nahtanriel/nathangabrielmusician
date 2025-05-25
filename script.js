let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    navbar.style.top = "-100px"; // hides navbar when scrolling down
  } else {
    navbar.style.top = "0"; // shows it when scrolling up
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.about-image-slider .fade-image');
  let currentIndex = 0;
  const fadeDuration = 1000; // duration matches CSS transition time (1 second)
  const displayDuration = 4000; // how long each image shows before fade

  // Initialize first image visible
  images[currentIndex].classList.add('active');

  setInterval(() => {
    const nextIndex = (currentIndex + 1) % images.length;

    // Start fade-in next image
    images[nextIndex].classList.add('active');

    // After fadeDuration, fade out the current image
    setTimeout(() => {
      images[currentIndex].classList.remove('active');
      currentIndex = nextIndex;
    }, fadeDuration);

  }, displayDuration);
});


