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

// ==============================
// INDEX PAGE: LATEST BLOG PREVIEW
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
  const previewContainer = document.getElementById("latest-blog-preview");
  if (!previewContainer) return; // Skip if not on index.html

  try {
    // Fetch the blog page
    const response = await fetch("blog.html");
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // Grab the first (latest) blog post
    const latestPost = doc.querySelector(".blog-post details");
    if (!latestPost) {
      previewContainer.innerHTML = "<p>No blog posts found.</p>";
      return;
    }

    // Extract data
    const title = latestPost.querySelector("h2")?.innerText || "Untitled";
    const date = latestPost.querySelector(".blog-date")?.innerText || "";
    const imgSrc = latestPost.querySelector("img")?.getAttribute("src") || "images/default-blog.jpg";
    const mdFile = latestPost.querySelector(".about-content")?.getAttribute("data-file");

    let previewText = "";
    if (mdFile) {
      const mdResponse = await fetch(mdFile);
      const mdContent = await mdResponse.text();
      previewText = mdContent.replace(/[#>*_\[\]\(\)`]/g, "").slice(0, 250) + "...";
    }

    // Construct preview
    previewContainer.innerHTML = `
      <article class="latest-post">
        <img src="${imgSrc}" alt="${title}" class="latest-post-image">
        <div class="latest-post-content">
          <h3>${title}</h3>
          <p class="blog-date">${date}</p>
          <p class="blog-preview-text">${previewText}</p>
          <a href="blog.html" class="btn">Read More</a>
        </div>
      </article>
    `;
  } catch (err) {
    console.error("Error loading latest blog post:", err);
    previewContainer.innerHTML = "<p>Failed to load latest post.</p>";
  }
});




