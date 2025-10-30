// ==============================
// NAVBAR SCROLL + PARALLAX HERO
// ==============================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const heroBg = document.querySelector('.hero-bg');
  const scrollPos = window.scrollY * 0.3;

  // Navbar background change
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Parallax hero effect (only if hero-bg exists)
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollPos}px)`;
  }

  // 🔹 Close mobile nav when scrolling
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// ==============================
// MOBILE NAV TOGGLE
// ==============================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ==============================
// FADE-IN SECTIONS ON SCROLL
// ==============================
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

// ==============================
// UNIVERSAL HERO SLIDESHOW (About / Media / Blog)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero[data-slideshow]");
  if (!hero) return;

  const folder = hero.getAttribute("data-slideshow");
  const heroBg = hero.querySelector(".hero-bg");

  const imageCounts = {
    about: 16,
    media: 10,
    blog: 2,
  };

  const imageCount = imageCounts[folder] || 10;
  const images = [];

  for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement("img");
    img.src = `images/${folder}/${folder}${i}.jpg`; // <- fixed path
    img.alt = `${folder} ${i}`;
    img.classList.add("slider-image");
    heroBg.appendChild(img);
    images.push(img);
  }

  let current = 0;
  images[current].classList.add("active");

  setInterval(() => {
    images[current].classList.remove("active");
    current = (current + 1) % imageCount;
    images[current].classList.add("active");
  }, 4000);
});


// ==============================
// ABOUT PAGE: LOAD MARKDOWN SECTIONS
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".about-content[data-file]").forEach(async (section) => {
    const file = section.getAttribute("data-file");
    try {
      const response = await fetch(file);
      const text = await response.text();
      section.innerHTML = marked.parse(text);
    } catch (err) {
      section.innerHTML = "<p>Content failed to load.</p>";
      console.error("Error loading content:", file, err);
    }
  });
});

// 🔻 Shared scroll indicator fade + smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const mainContent = document.querySelector("#main-content");

  if (!scrollIndicator) return;

  // Fade out indicator on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });

  // Smooth scroll on click
  scrollIndicator.addEventListener("click", () => {
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const previewContainer = document.getElementById("latest-blog-preview");
  if (!previewContainer) return; // Only run on homepage

  try {
    const response = await fetch("blog.html");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const firstPost = doc.querySelector(".blog-post");
    if (firstPost) {
      const title = firstPost.querySelector("h2")?.textContent || "Latest Post";
      const date = firstPost.querySelector(".blog-date")?.textContent || "";
      const img = firstPost.querySelector("img")?.getAttribute("src") || "";
      const excerpt = firstPost.querySelector(".about-content")?.textContent.slice(0, 180) + "...";
      
      previewContainer.innerHTML = `
        <article class="blog-preview fade-section">
          <img src="${img}" alt="${title}" class="blog-preview-image">
          <div class="blog-preview-text">
            <h2>${title}</h2>
            <p class="blog-date">${date}</p>
            <p>${excerpt}</p>
            <a href="blog.html" class="read-more">Read More →</a>
          </div>
        </article>
      `;
    }
  } catch (error) {
    console.error("Failed to load latest blog post:", error);
  }
});




