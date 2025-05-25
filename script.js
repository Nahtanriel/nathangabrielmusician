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
