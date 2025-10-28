// Existing scroll/hamburger/menu/modal code remains unchanged
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    navbar.style.top = "-40px";
    if (hamburger.classList.contains("open") || navLinks.classList.contains("active")) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("active");
    }
  } else {
    navbar.style.top = "0";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("active");
});

const modal = document.getElementById("bookingModal");
const formContainer = document.getElementById("formContainer");
const toggleBtn = document.getElementById("toggleBookingModal");
const closeBtn = document.getElementById("closeModalBtn");

const imageTriggers = [
  'images/acoustic.jpg',
  'images/largesound.jpg',
  'images/busking.jpg',
];

let isModalOpen = false;
let formLoaded = false;
let lastFocusedElement = null;

function openModal() {
  lastFocusedElement = document.activeElement;

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
    iframe.id = "bookingIframe";

    formContainer.innerHTML = "";
    formContainer.appendChild(iframe);
    formLoaded = true;

    // Once iframe is loaded, set up message passing
    iframe.addEventListener("load", () => {
      setupGigDurationCalculation();
    });
  }

  const currentScrollY = window.scrollY || window.pageYOffset;
  window.scrollTo(0, currentScrollY - 1);
  modal.scrollIntoView({ behavior: "smooth", block: "start" });

  document.body.classList.add("modal-open");
  trapFocus(modal);
}

function closeModal() {
  modal.style.display = "none";
  isModalOpen = false;
  toggleBtn.textContent = "BOOK NOW";
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
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
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
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
document.querySelectorAll(".service-trigger").forEach(btn => {
  btn.addEventListener("click", openModal);
});

document.querySelectorAll(".service-card h3").forEach(heading => {
  const src = heading.getAttribute("data-src");
  if (imageTriggers.includes(src)) {
    heading.style.cursor = "pointer";
    heading.addEventListener("click", openModal);
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


function setupGigDurationCalculation() {
  const iframe = document.getElementById("bookingIframe");
  const interval = setInterval(() => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      const timeInput = doc.querySelector("input[name*='eventStart']");
      const setDropdown = doc.querySelector("select[name*='numberOfSets']");
      const paragraph = doc.querySelector("#gigDurationMessage");

      if (!timeInput || !setDropdown || !paragraph) return;

      function calculate() {
        if (!timeInput.value || !setDropdown.value) return;

        const sets = parseInt(setDropdown.value);
        const totalMinutes = sets * 45 + (sets - 1) * 15;

        const [timeStr, modifier] = timeInput.value.split(" ");
        let [hours, minutes] = timeStr.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const startDate = new Date();
        startDate.setHours(hours, minutes);

        const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

        let endHour = endDate.getHours();
        let endMin = endDate.getMinutes();
        const endAMPM = endHour >= 12 ? "PM" : "AM";
        if (endHour > 12) endHour -= 12;
        if (endHour === 0) endHour = 12;
        if (endMin < 10) endMin = "0" + endMin;

        const formattedStart = timeInput.value;
        const formattedEnd = `${endHour}:${endMin} ${endAMPM}`;

        paragraph.innerText = `Your gig will run from ${formattedStart} to ${formattedEnd}.`;
      }

      timeInput.addEventListener("change", calculate);
      setDropdown.addEventListener("change", calculate);

      clearInterval(interval); // stop trying once it's working
    } catch (err) {
      // Wait until iframe is fully available
    }
  }, 1000);
}
