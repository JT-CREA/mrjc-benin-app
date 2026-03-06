/**
 * MRJC-BÉNIN | navigation.js
 * Gestion de la navigation mobile, dropdowns animés, ticker
 */

"use strict";

/* ============================================================
   NAVIGATION MOBILE
   ============================================================ */
function initMobileNav() {
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".overlay");
  const closeBtn = mobileNav?.querySelector(".mobile-nav__close");

  if (!burger || !mobileNav) return;

  function openNav() {
    burger.classList.add("open");
    mobileNav.classList.add("open");
    overlay?.classList.add("active");
    document.body.style.overflow = "hidden";
    burger.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
  }

  function closeNav() {
    burger.classList.remove("open");
    mobileNav.classList.remove("open");
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");

    // Reset sub-menus
    document.querySelectorAll(".mobile-nav__sub.open").forEach((sub) => {
      sub.classList.remove("open");
      sub.previousElementSibling
        ?.querySelector("i.ri-arrow-down-s-line")
        ?.classList.remove("rotated");
    });
  }

  burger.addEventListener("click", () => {
    burger.classList.contains("open") ? closeNav() : openNav();
  });

  closeBtn?.addEventListener("click", closeNav);
  overlay?.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Sous-menus mobiles accordéon
  document
    .querySelectorAll(".mobile-nav__link[data-has-sub]")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const sub = link.nextElementSibling;
        if (!sub?.classList.contains("mobile-nav__sub")) return;

        // Fermer les autres
        document.querySelectorAll(".mobile-nav__sub.open").forEach((s) => {
          if (s !== sub) {
            s.classList.remove("open");
            s.previousElementSibling
              ?.querySelector("i")
              ?.classList.remove("rotated");
          }
        });

        sub.classList.toggle("open");
        link.querySelector("i")?.classList.toggle("rotated");
      });
    });

  // Fermer sur redimensionnement
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeNav();
  });

  // Accessibilité
  burger.setAttribute("aria-label", "Ouvrir le menu de navigation");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-controls", "mobile-nav");
  mobileNav.setAttribute("aria-hidden", "true");
  mobileNav.id = "mobile-nav";
}

/* ============================================================
   TICKER / BANDE DÉFILANTE
   ============================================================ */
async function initTicker() {
  const tickerContent = document.querySelector(".ticker-content");
  if (!tickerContent) return;

  try {
    const data = await window.MRJC.fetchData("blog.json");
    const items = data?.ticker_items || [];

    if (!items.length) return;

    // Dupliquer pour le scroll infini
    const allItems = [...items, ...items];
    tickerContent.innerHTML = allItems
      .map(
        (item) =>
          `<span class="ticker-item">
            <i class="ri-arrow-right-circle-fill" style="color:var(--color-accent-light);font-size:14px"></i>
            ${item}
          </span>`,
      )
      .join("");

    // Vitesse adaptée à la longueur du contenu
    const totalWidth = tickerContent.scrollWidth / 2;
    const speed = Math.max(20, totalWidth / 40); // px/s
    const duration = totalWidth / speed;
    tickerContent.style.animationDuration = `${duration}s`;

    // Click sur item → possible navigation
    tickerContent.querySelectorAll(".ticker-item").forEach((item, i) => {
      item.addEventListener("click", () => {
        // Navigation contextuelle selon le type d'item
        // Implémentation selon contenu
      });
    });
  } catch (error) {
    console.warn("[MRJC] Ticker: erreur chargement", error);
  }
}

/* ============================================================
   NAV DROPDOWN — Accessibilité et touch
   ============================================================ */
function initDropdowns() {
  const navItems = document.querySelectorAll(".nav__item");

  navItems.forEach((item) => {
    const dropdown = item.querySelector(".nav__dropdown");
    if (!dropdown) return;

    let timeout;

    // Desktop hover
    item.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
    });

    item.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => {
        // CSS gère l'affichage via :hover, rien à faire ici
      }, 200);
    });

    // Touch devices — toggle
    const link = item.querySelector(".nav__link");
    let touchOpened = false;

    link?.addEventListener("touchend", (e) => {
      if (!touchOpened) {
        e.preventDefault();
        touchOpened = true;
        // Fermer les autres
        navItems.forEach((other) => {
          if (other !== item) {
            other
              .querySelector(".nav__dropdown")
              ?.classList.remove("touch-open");
          }
        });
        dropdown.classList.add("touch-open");
      } else {
        touchOpened = false;
        dropdown.classList.remove("touch-open");
      }
    });

    // Fermer au clic hors dropdown
    document.addEventListener("touchstart", (e) => {
      if (!item.contains(e.target)) {
        dropdown.classList.remove("touch-open");
        touchOpened = false;
      }
    });

    // Accessibilité clavier
    link?.setAttribute("aria-haspopup", "true");
    link?.setAttribute("aria-expanded", "false");
    dropdown.id = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    link?.setAttribute("aria-controls", dropdown.id);

    item.addEventListener("mouseenter", () =>
      link?.setAttribute("aria-expanded", "true"),
    );
    item.addEventListener("mouseleave", () =>
      link?.setAttribute("aria-expanded", "false"),
    );
  });
}

/* ============================================================
   HERO SLIDER
   ============================================================ */
function initHeroSlider() {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dotsContainer = slider.querySelector(".hero-slider__dots");
  if (slides.length <= 1) return;

  let currentSlide = 0;
  let autoplayInterval;
  let isTransitioning = false;

  // Créer les dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = `slider-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Diapositive ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    slides[currentSlide].classList.remove("active");
    dotsContainer
      ?.querySelectorAll(".slider-dot")
      [currentSlide]?.classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    dotsContainer
      ?.querySelectorAll(".slider-dot")
      [currentSlide]?.classList.add("active");

    setTimeout(() => (isTransitioning = false), 900);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Init
  slides[0].classList.add("active");
  startAutoplay();

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  slider.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
    }
  });

  // Prev/Next buttons
  slider
    .querySelector(".slider-prev")
    ?.addEventListener("click", () => goToSlide(currentSlide - 1));
  slider
    .querySelector(".slider-next")
    ?.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Keyboard
  slider.setAttribute("tabindex", "0");
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
  });
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;
  btn.innerHTML = '<i class="ri-arrow-up-line"></i>';
  btn.setAttribute("aria-label", "Retour en haut");
  btn.title = "Retour en haut";
}

/* ============================================================
   STICKY SIDEBAR
   ============================================================ */
function initStickySidebar() {
  const sidebar = document.querySelector(".sidebar--sticky");
  if (!sidebar) return;

  const header = document.querySelector(".header");
  const navHeight = header ? header.offsetHeight : 72;
  sidebar.style.top = `${navHeight + 24}px`;
}

/* ============================================================
   NAV HIGHLIGHT selon scroll (sections)
   ============================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav__link[href*="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href").endsWith(`#${id}`),
            );
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   INITIALISATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initTicker();
  initDropdowns();
  initHeroSlider();
  initBackToTop();
  initStickySidebar();
  initScrollSpy();
});
