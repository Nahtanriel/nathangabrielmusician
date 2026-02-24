(function() {
  "use strict";

  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const sections = document.querySelectorAll('.section');
  let lastScrollY = window.scrollY;
  let heroBg = null;

  const on = (el, evt, fn, opts = { passive: true }) => {
    if (el) el.addEventListener(evt, fn, opts);
  };

  const toggleNav = (e) => {
    e && e.preventDefault();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  };

  const handleScroll = () => {
    const y = window.scrollY;
    if (y > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (y > lastScrollY && y > 200) navbar.classList.add('hide');
    else navbar.classList.remove('hide');

    if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    lastScrollY = y;

    document.body.classList.toggle('scrolled', y > 100);
  };

  const initSectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
  };

  // utilities for locking/unlocking page scroll when lightbox is open
  let storedScrollY = 0;
  const lockScroll = () => {
    storedScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, storedScrollY);
  };

  // common behaviour applied to each video card (either open lightbox or load into inline player)
  const addVideoCardBehavior = (card, lightboxIframe, lightbox) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const alt = card.querySelector('img')?.alt || 'video';
    card.setAttribute('aria-label', `Play ${alt}`);

    const play = () => {
      const id = card.dataset.video;
      if (lightbox && lightboxIframe) {
        lightboxIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        lightbox.classList.add('active');
        lockScroll();
      }
    };

    card.addEventListener('click', play);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play();
      }
    });
  };



  const initSlide = (folder, count = 5) => {
    const hero = document.querySelector(`.hero[data-slideshow="${folder}"]`);
    if (!hero) return;
    const hbg = hero.querySelector('.hero-bg');
    const imgs = [];
    let current = Math.floor(Math.random() * count);
    let firstLoaded = false;

    for (let i = 1; i <= count; i++) {
      const img = document.createElement('img');
      img.src = `/images/${folder}/${folder}${i}.webp`;
      img.alt = `${folder} ${i}`;
      img.className = 'slider-image';
      img.onload = () => {
        if (i - 1 === current) {
          img.classList.add('active');
          firstLoaded = true;
        }
      };
      img.onerror = () => console.warn('Missing:', img.src);
      hbg.appendChild(img);
      imgs.push(img);
    }

    const start = () => {
      if (!firstLoaded) {
        requestAnimationFrame(start);
        return;
      }
      setInterval(() => {
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
      }, 4000);
    };

    start();
  };

  const loadMarkdown = () => {
    document.querySelectorAll('.about-content, .blog-content').forEach(container => {
      const file = container.dataset.file;
      if (!file) return;
      const fullPath = file.startsWith('/') ? file : `/${file}`;
      fetch(fullPath)
        .then(res => {
          if (!res.ok) throw new Error(res.status);
          return res.text();
        })
        .then(text => {
          container.innerHTML = marked.parse(text);
          requestAnimationFrame(() => container.classList.add('loaded'));
        })
        .catch(e => console.error('Error loading content:', e));
    });
  };

  const initScrollIndicator = () => {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', () => {
      document.querySelector('#main-content')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const initDetails = () => {
    document.querySelectorAll('details').forEach(detail => {
      detail.addEventListener('toggle', function () {
        if (this.open) {
          document.querySelectorAll('details').forEach(other => {
            if (other !== this) other.removeAttribute('open');
          });
        }
      });
    });
  };

  const initTestimonials = () => {
    const wrapper = document.querySelector('.testimonial-fade-wrapper');
    if (!wrapper) return;
    const cards = Array.from(wrapper.querySelectorAll('.testimonial-card'));
    let idx = 0;
    const show = i => cards.forEach((c, j) => c.classList.toggle('active', j === i));
    const next = () => { idx = (idx + 1) % cards.length; show(idx); };
    const prev = () => { idx = (idx - 1 + cards.length) % cards.length; show(idx); };
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    prevBtn.className = 'scroll-btn left testimonial-prev'; prevBtn.innerHTML = '&#8249;';
    nextBtn.className = 'scroll-btn right testimonial-next'; nextBtn.innerHTML = '&#8250;';
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    let startX = 0;
    wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    wrapper.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) prev();
      else if (startX - endX > 50) next();
    });
  };

  const initImageLightbox = () => {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    if (!lightbox || !lightboxImg || !closeBtn) return;

    document.querySelectorAll('.photo-card img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        lockScroll();                    // match video behaviour
      });
    });

    // prevent wheel from scrolling the page while lightbox open
    lightbox.addEventListener('wheel', e => e.preventDefault(), { passive: false });

    const close = () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      unlockScroll();                  // restore original scroll position
    };

    closeBtn.setAttribute('role', 'button');
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.addEventListener('click', close);

    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    // allow Esc key to dismiss
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        close();
      }
    });
  };

  // when clicked the card will open a lightbox or update the inline player if available
  const initVideoLightbox = () => {
    const lightbox = document.getElementById('video-lightbox');
    const iframe = document.getElementById('lightbox-iframe');
    const closeBtn = document.querySelector('.close-lightbox');

    if (!lightbox || !iframe || !closeBtn) return;

    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => addVideoCardBehavior(card, iframe, lightbox));

    // prevent background scroll when wheel inside lightbox
    lightbox.addEventListener('wheel', e => e.preventDefault(), { passive: false });

    const close = () => {
      lightbox.classList.remove('active');
      iframe.src = '';
      unlockScroll();
    };
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    document.querySelectorAll('.video-scroll').forEach(scrollContainer => {
      scrollContainer.addEventListener('wheel', e => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY * 0.6;
      }, { passive: false });
    });

    // add manual arrow buttons to wrappers
    document.querySelectorAll('.video-scroll-wrapper').forEach(wrapper => {
      const scrollInner = wrapper.querySelector('.video-scroll');
      if (!scrollInner) return;
      const prevBtn = document.createElement('button');
      const nextBtn = document.createElement('button');
      prevBtn.className = 'scroll-btn left'; prevBtn.innerHTML = '&#8249;';
      nextBtn.className = 'scroll-btn right'; nextBtn.innerHTML = '&#8250;';
      wrapper.appendChild(prevBtn);
      wrapper.appendChild(nextBtn);
      prevBtn.addEventListener('click', () => {
        scrollInner.scrollBy({ left: -300, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        scrollInner.scrollBy({ left: 300, behavior: 'smooth' });
      });
    });
  };

  const initNavLinks = () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
      // ensure accessibility for current page
      if (link.classList.contains('active')) {
        link.setAttribute('aria-current', 'page');
      }
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero[data-slideshow]');
    heroBg = hero ? hero.querySelector('.hero-bg') : null;

    on(window, 'scroll', handleScroll);
    if (hamburger && navLinks) {
      on(hamburger, 'click', toggleNav, { passive: false });
      initNavLinks();
    }

    ['index', 'about', 'media', 'contact'].forEach(f => initSlide(f));
    loadMarkdown();
    initScrollIndicator();
    // smooth scroll for fixed book button (useful when on contact page)
    document.querySelectorAll('a.fixed-book-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    initDetails();
    initTestimonials();
    initImageLightbox();
    initVideoLightbox();
    initSectionObserver();
  });
})();
