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

  const imageCounts = { index: 6, about: 18, media: 13, blog: 13 };
  const imageCount = imageCounts[folder] || 10;
  const images = [];

  for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement("img");
    img.src = `images/${folder}/${folder}${i}.jpg`;
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

document.addEventListener("DOMContentLoaded", async () => {
  const previewContainer = document.getElementById("latest-blog-preview");
  if (!previewContainer) return;

  try {
    const response = await fetch("blog.html");
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const allPosts = doc.querySelectorAll("section.fade-section details");
    const latestPost = allPosts[allPosts.length - 1];
    if (!latestPost) {
      previewContainer.innerHTML = "<p>No blog posts found.</p>";
      return;
    }

    const title = latestPost.querySelector("h2")?.innerText || "Untitled";
    const date = latestPost.querySelector(".blog-date")?.innerText || "";
    const mdFile = latestPost.querySelector(".blog-content")?.getAttribute("data-file");

    let imgSrc = latestPost.querySelector("img")?.getAttribute("src") || "images/default-blog.jpg";

    let previewText = "";

    if (mdFile) {
      const mdResponse = await fetch(mdFile);
      const mdContent = await mdResponse.text();

      const cleanText = mdContent
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "") 
        .replace(/[#>*_\[\]\(\)`]/g, "")      
        .trim();

      previewText = cleanText.slice(0, 250) + "...";
    }

    previewContainer.innerHTML = `
      <article class="latest-post">
        <img src="${imgSrc}" alt="${title}" class="latest-post-image">
        <div class="latest-post-content">
          <h3>${title}</h3>
          <p class="blog-date">${date}</p>
          <p class="blog-preview-text">${previewText}</p>
          <a href="blog.html#${latestPost.id}" class="btn">Read More</a>
        </div>
      </article>
    `;
  } catch (err) {
    console.error("Error loading latest blog post:", err);
    previewContainer.innerHTML = "<p>Failed to load latest post.</p>";
  }
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

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", function () {
    if (this.open) {
      document.querySelectorAll("details").forEach((other) => {
        if (other !== this) other.open = false;
      });

      this.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
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