window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const heroBg = document.querySelector('.hero-bg');
  const scrollPos = window.scrollY * 0.3;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollPos}px)`;
  }

  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

const sections = document.querySelectorAll('.section');
const revealSections = () => {
  const triggerBottom = window.innerHeight * 0.85;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero[data-slideshow]");
  if (!hero) return;

  const folder = hero.getAttribute("data-slideshow");
  const heroBg = hero.querySelector(".hero-bg");

  const imageCounts = { index: 5, about: 5, media: 5, contact: 5, };
  const imageCount = imageCounts[folder] || 10;
  const images = [];

  for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement("img");
    img.src = `/images/${folder}/${folder}${i}.jpg`;
    img.alt = `${folder} ${i}`;
    img.classList.add("slider-image");
    heroBg.appendChild(img);
    images.push(img);
  }

  let current = Math.floor(Math.random() * images.length);
  let firstLoaded = false;

  const firstImg = images[current];
  firstImg.onload = () => {
    firstImg.classList.add("active");
    firstLoaded = true;
  };
  firstImg.onerror = () => console.warn(`Missing: ${firstImg.src}`);

  images.forEach((img, i) => {
    if (i !== current) {
      img.onload = () => {};
      img.onerror = () => console.warn(`Missing: ${img.src}`);
    }
  });

  const startSlideshow = () => {
    if (!firstLoaded) {
      requestAnimationFrame(startSlideshow);
      return;
    }
    setInterval(() => {
      images[current].classList.remove("active");
      current = (current + 1) % images.length;
      images[current].classList.add("active");
    }, 4000);
  };

  startSlideshow();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.about-content, .blog-content').forEach(container => {
    const file = container.getAttribute('data-file');
    if (!file) return;

    const fullPath = file.startsWith('/') ? file : `/${file}`;

    fetch(fullPath)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${fullPath}`);
        return response.text();
      })
      .then(text => {
        container.innerHTML = marked.parse(text);
        requestAnimationFrame(() => {
          container.classList.add('loaded');
        });
      })
      .catch(error => console.error('Error loading content:', error));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const mainContent = document.querySelector("#main-content");

  if (!scrollIndicator) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });

  scrollIndicator.addEventListener("click", () => {
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', function () {
      if (this.open) {
        document.querySelectorAll('details').forEach((otherDetail) => {
          if (otherDetail !== this) {
            otherDetail.removeAttribute('open');
          }
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".testimonial-fade-wrapper");
  const cards = Array.from(wrapper.querySelectorAll(".testimonial-card"));
  let currentIndex = 0;

  const prevBtn = document.createElement("button");
  prevBtn.className = "scroll-btn left testimonial-prev";
  prevBtn.innerHTML = "&#8249;";
  const nextBtn = document.createElement("button");
  nextBtn.className = "scroll-btn right testimonial-next";
  nextBtn.innerHTML = "&#8250;";

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  }

  prevBtn.addEventListener("click", prevCard);
  nextBtn.addEventListener("click", nextCard);

  let startX = 0;
  wrapper.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  wrapper.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevCard();
    else if (startX - endX > 50) nextCard();
  });

  function updateArrowVisibility() {
    const isDesktop = window.matchMedia("(min-width: 601px)").matches;
    prevBtn.style.opacity = isDesktop ? "1" : "0";
    nextBtn.style.opacity = isDesktop ? "1" : "0";
    prevBtn.style.pointerEvents = isDesktop ? "auto" : "none";
    nextBtn.style.pointerEvents = isDesktop ? "auto" : "none";
  }

  window.addEventListener("resize", updateArrowVisibility);
  updateArrowVisibility();

  showCard(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("video-lightbox");
  const iframe = document.getElementById("lightbox-iframe");
  const closeBtn = document.querySelector(".close-lightbox");

  if (lightbox && iframe && closeBtn) {
    document.querySelectorAll(".video-card").forEach(card => {
      card.addEventListener("click", () => {
        const videoId = card.dataset.video;
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; 
      });
    });

    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove("active");
      iframe.src = "";
      document.body.style.overflow = "";
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
        iframe.src = "";
        document.body.style.overflow = "";
      }
    });
  }

  document.querySelectorAll(".video-scroll").forEach(scrollContainer => {
    scrollContainer.addEventListener("wheel", (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY * 0.6; 
    });
  });
});

document.querySelectorAll(".video-scroll-wrapper").forEach(wrapper => {
  const scroll = wrapper.querySelector(".video-scroll");
  const left = wrapper.querySelector(".scroll-btn.left");
  const right = wrapper.querySelector(".scroll-btn.right");

  left.addEventListener("click", () => (scroll.scrollLeft -= 350));
  right.addEventListener("click", () => (scroll.scrollLeft += 350));
});

let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (Math.abs(currentScrollY - lastScrollY) > 5) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {

      navbar.classList.add('hide');
    } else {
      navbar.classList.remove('hide');
    }
  }

  lastScrollY = currentScrollY;
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});



