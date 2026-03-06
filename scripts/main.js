/**
 * MRJC-BÉNIN | main.js
 * Point d'entrée principal — initialisation de l'application
 */

"use strict";

/* ============================================================
   CONFIGURATION GLOBALE
   ============================================================ */
const APP = {
  name: "MRJC-BÉNIN",
  version: "1.0.0",
  dataPath: "../data/",
  cache: new Map(),
  debug: false,
};

/* ============================================================
   UTILITAIRES
   ============================================================ */

/**
 * Fetch des données JSON avec cache
 */
async function fetchData(file) {
  if (APP.cache.has(file)) return APP.cache.get(file);
  try {
    const basePath = getBasePath();
    const response = await fetch(`${basePath}data/${file}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    APP.cache.set(file, data);
    return data;
  } catch (error) {
    console.error(`[MRJC] Erreur chargement ${file}:`, error);
    return null;
  }
}

/**
 * Déterminer le chemin de base selon la profondeur de la page
 */
function getBasePath() {
  const depth = window.location.pathname.split("/").filter(Boolean).length;
  const isInPages = window.location.pathname.includes("/pages/");
  const isInDomaines = window.location.pathname.includes("/domaines/");
  if (isInDomaines) return "../../";
  if (isInPages) return "../";
  return "./";
}

/**
 * Formater une date en français
 */
function formatDate(dateStr, options = {}) {
  const defaults = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    ...defaults,
    ...options,
  });
}

/**
 * Formater un nombre (ex: 150000 → 150 000)
 */
function formatNumber(num) {
  return new Intl.NumberFormat("fr-FR").format(num);
}

/**
 * Tronquer un texte
 */
function truncate(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "…";
}

/**
 * Debounce
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Vérifier si un élément est visible dans le viewport
 */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

/**
 * Animer les compteurs
 */
function animateCounter(
  element,
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
) {
  const start = 0;
  const startTime = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(easeOut(progress) * target);
    element.textContent = prefix + formatNumber(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = prefix + formatNumber(target) + suffix;
  }

  requestAnimationFrame(update);
}

/**
 * Toast notification
 */
function showToast(message, type = "success", duration = 3500) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "ri-check-circle-line",
    error: "ri-error-warning-line",
    info: "ri-information-line",
    warning: "ri-alert-line",
  };

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="${icons[type] || icons.success}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeIn 0.3s reverse both";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Créer un slug depuis un texte
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ============================================================
   INTERSECTION OBSERVER — Reveal animations
   ============================================================ */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children",
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================================
   COMPTEURS — Impact statistics
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = "true";
          const target = parseInt(entry.target.dataset.count);
          const suffix = entry.target.dataset.suffix || "";
          const prefix = entry.target.dataset.prefix || "";
          animateCounter(entry.target, target, 2200, prefix, suffix);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ============================================================
   SCROLL BEHAVIOR
   ============================================================ */
function initScrollBehavior() {
  const header = document.querySelector(".header");
  const scrollBtn = document.getElementById("scroll-top");

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;

    // Header scroll effect
    if (header) {
      header.classList.toggle("scrolled", scrollY > 50);
    }

    // Scroll to top button
    if (scrollBtn) {
      scrollBtn.classList.toggle("visible", scrollY > 400);
    }
  }, 50);

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Scroll to top
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav__link, .mobile-nav__link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = new URL(href, window.location.href).pathname;
    if (
      currentPath === linkPath ||
      (linkPath !== "/" &&
        linkPath !== "/index.html" &&
        currentPath.startsWith(linkPath))
    ) {
      link.classList.add("active");
    }
  });
}

/* ============================================================
   RIPPLE EFFECT sur les boutons
   ============================================================ */
function initRippleEffect() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".lightbox__img");
  const caption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");

  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showImage(index) {
    const item = currentImages[index];
    img.src = item.url || item;
    if (caption) caption.textContent = item.caption || "";
    if (prevBtn)
      prevBtn.style.display = currentImages.length > 1 ? "flex" : "none";
    if (nextBtn)
      nextBtn.style.display = currentImages.length > 1 ? "flex" : "none";
  }

  closeBtn?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevBtn?.click();
    if (e.key === "ArrowRight") nextBtn?.click();
  });

  // Expose globally
  window.openLightbox = openLightbox;

  // Auto-init gallery items
  document.querySelectorAll("[data-gallery]").forEach((el) => {
    el.addEventListener("click", () => {
      const galleryId = el.dataset.gallery;
      const allItems = [
        ...document.querySelectorAll(`[data-gallery="${galleryId}"]`),
      ];
      const index = allItems.indexOf(el);
      const images = allItems.map((item) => ({
        url: item.dataset.src || item.src || item.style.backgroundImage,
        caption: item.dataset.caption || "",
      }));
      openLightbox(images, index);
    });
    el.style.cursor = "zoom-in";
  });
}

/* ============================================================
   TABS
   ============================================================ */
function initTabs() {
  document.querySelectorAll(".tabs").forEach((tabsContainer) => {
    const buttons = tabsContainer.querySelectorAll(".tab-btn");
    const panels = tabsContainer.querySelectorAll(".tab-panel");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const panel = tabsContainer.querySelector(
          `[data-tab-panel="${target}"]`,
        );
        if (panel) panel.classList.add("active");
      });
    });

    // Activate first by default
    if (buttons[0]) buttons[0].click();
  });
}

/* ============================================================
   MODAL
   ============================================================ */
function initModals() {
  document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.dataset.modalTrigger;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest(".modal__close")) {
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.active").forEach((m) => {
        m.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  });
}

/* ============================================================
   COOKIE BANNER
   ============================================================ */
function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const accepted = localStorage.getItem("mrjc_cookies_accepted");
  if (!accepted) {
    setTimeout(() => banner.classList.add("visible"), 1000);
  }

  banner.querySelector("#accept-cookies")?.addEventListener("click", () => {
    localStorage.setItem("mrjc_cookies_accepted", "all");
    banner.classList.remove("visible");
    showToast("Préférences de cookies enregistrées.", "success");
  });

  banner.querySelector("#decline-cookies")?.addEventListener("click", () => {
    localStorage.setItem("mrjc_cookies_accepted", "essential");
    banner.classList.remove("visible");
  });
}

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
function initNewsletterForms() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector("button");
      const email = input?.value.trim();

      if (!email || !isValidEmail(email)) {
        input?.classList.add("is-invalid");
        showToast("Veuillez entrer une adresse email valide.", "error");
        return;
      }

      input?.classList.remove("is-invalid");
      btn?.classList.add("btn--loading");

      // Simulation envoi
      await new Promise((r) => setTimeout(r, 1500));

      btn?.classList.remove("btn--loading");
      input.value = "";
      showToast(
        "🎉 Inscription réussie ! Merci de rejoindre notre communauté.",
        "success",
        4000,
      );

      // Sauvegarder localement (démo)
      const subscribers = JSON.parse(
        localStorage.getItem("mrjc_subscribers") || "[]",
      );
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem("mrjc_subscribers", JSON.stringify(subscribers));
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');

    // Validation
    let isValid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      field.classList.remove("is-invalid", "is-valid");
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.add("is-valid");
      }
    });

    if (!isValid) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    btn?.classList.add("btn--loading");
    await new Promise((r) => setTimeout(r, 2000));
    btn?.classList.remove("btn--loading");

    showToast(
      "✅ Message envoyé avec succès ! Nous vous répondrons dans les 48h.",
      "success",
      5000,
    );
    form.reset();
    form
      .querySelectorAll(".is-valid")
      .forEach((f) => f.classList.remove("is-valid"));
  });
}

/* ============================================================
   SEARCH OVERLAY
   ============================================================ */
function initSearch() {
  const overlay = document.getElementById("search-overlay");
  const searchBtns = document.querySelectorAll("[data-search-open]");
  const closeBtn = overlay?.querySelector("[data-search-close]");
  const input = overlay?.querySelector(".search-overlay__input");
  const results = overlay?.querySelector(".search-overlay__results");

  if (!overlay) return;

  function openSearch() {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => input?.focus(), 200);
  }

  function closeSearch() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    if (results) results.innerHTML = "";
    if (input) input.value = "";
  }

  searchBtns.forEach((btn) => btn.addEventListener("click", openSearch));
  closeBtn?.addEventListener("click", closeSearch);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active"))
      closeSearch();
    // Keyboard shortcut Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      overlay.classList.contains("active") ? closeSearch() : openSearch();
    }
  });

  // Live search
  input?.addEventListener(
    "input",
    debounce(async (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        results.innerHTML = "";
        return;
      }

      const [blogData, projectsData] = await Promise.all([
        fetchData("blog.json"),
        fetchData("projects.json"),
      ]);

      const allItems = [
        ...(blogData?.posts || []).map((p) => ({
          ...p,
          type: "Article",
          href: `pages/blog.html#${p.slug}`,
        })),
        ...(projectsData || []).map((p) => ({
          ...p,
          type: "Projet",
          href: `pages/interventions.html#${p.slug}`,
        })),
      ];

      const matched = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.excerpt || item.summary || "").toLowerCase().includes(query),
      );

      if (!matched.length) {
        results.innerHTML = `<p style="color:var(--color-text-muted);font-size:var(--text-sm);padding:var(--space-4) 0;">Aucun résultat pour "<strong>${query}</strong>"</p>`;
        return;
      }

      results.innerHTML = matched
        .slice(0, 6)
        .map(
          (item) => `
        <a href="${item.href}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('active')">
          <span class="badge badge--${item.type === "Projet" ? "secondary" : "primary"}" style="font-size:10px">${item.type}</span>
          <span>${item.title}</span>
        </a>`,
        )
        .join("");
    }, 300),
  );
}

/* ============================================================
   INITIALISATION PRINCIPALE
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initCounters();
  initScrollBehavior();
  initActiveNavLink();
  initRippleEffect();
  initLightbox();
  initTabs();
  initModals();
  initCookieBanner();
  initNewsletterForms();
  initContactForm();
  initSearch();

  if (APP.debug) console.log("[MRJC] Application initialisée ✓");
});

/* ============================================================
   EXPORTS (pour les autres modules)
   ============================================================ */
window.MRJC = {
  fetchData,
  formatDate,
  formatNumber,
  truncate,
  debounce,
  throttle,
  showToast,
  slugify,
  getBasePath,
  isValidEmail,
};
