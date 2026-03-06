/**
 * MRJC-BÉNIN | projects.js
 * Gestion et affichage dynamique des projets
 */

"use strict";

/* ============================================================
   CONSTANTES
   ============================================================ */
const STATUS_CONFIG = {
  ongoing: {
    label: "En cours",
    badge: "badge--ongoing",
    icon: "ri-pulse-line",
  },
  closed: {
    label: "Clôturé",
    badge: "badge--closed",
    icon: "ri-check-double-line",
  },
  planned: { label: "Planifié", badge: "badge--planned", icon: "ri-time-line" },
};

const DOMAIN_CONFIG = {
  agriculture: {
    label: "Conseil Agricole",
    icon: "ri-plant-line",
    color: "#1B5E20",
    bg: "#E8F5E9",
  },
  sante: {
    label: "Santé & Nutrition",
    icon: "ri-heart-pulse-line",
    color: "#0D47A1",
    bg: "#E3F2FD",
  },
  education: {
    label: "Alphabétisation",
    icon: "ri-book-open-line",
    color: "#E65100",
    bg: "#FBE9E7",
  },
  femmes: {
    label: "Autonomisation",
    icon: "ri-women-line",
    color: "#7B1FA2",
    bg: "#F3E5F5",
  },
  intermediation: {
    label: "Intermédiation",
    icon: "ri-community-line",
    color: "#1565C0",
    bg: "#E3F2FD",
  },
};

/* ============================================================
   RENDU D'UNE CARTE PROJET
   ============================================================ */
function renderProjectCard(project) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.ongoing;
  const domain = DOMAIN_CONFIG[project.domain] || DOMAIN_CONFIG.agriculture;
  const basePath = window.MRJC?.getBasePath?.() || "./";

  const startDate =
    window.MRJC?.formatDate(project.startDate, {
      year: "numeric",
      month: "short",
    }) || project.startDate;
  const endDate = project.endDate
    ? window.MRJC?.formatDate(project.endDate, {
        year: "numeric",
        month: "short",
      })
    : "En cours";

  const beneficiariesFormatted =
    window.MRJC?.formatNumber(project.beneficiaries) || project.beneficiaries;

  return `
    <article class="card project-card reveal" data-id="${project.id}" data-status="${project.status}" data-domain="${project.domain}">
      <div class="card__img-wrapper">
        <img
          src="${project.thumbnail}"
          alt="${project.title}"
          class="card__img"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80'"
        />
        <div class="card__badge">
          <span class="badge ${status.badge}">
            <i class="${status.icon}"></i>
            ${status.label}
          </span>
        </div>
        ${
          project.gallery?.length > 0
            ? `<button class="card-gallery-btn" onclick="openProjectGallery(${project.id})" title="Voir la galerie photos">
              <i class="ri-image-line"></i>
              <span>${project.gallery.length} photos</span>
            </button>`
            : ""
        }
      </div>
      <div class="card__body">
        <div class="card__meta">
          <span style="display:inline-flex;align-items:center;gap:4px;">
            <span style="width:28px;height:28px;border-radius:6px;background:${domain.bg};display:inline-flex;align-items:center;justify-content:center;">
              <i class="${domain.icon}" style="color:${domain.color};font-size:14px;"></i>
            </span>
            <span style="color:${domain.color};font-weight:600;font-size:11px;">${domain.label}</span>
          </span>
          <span><i class="ri-map-pin-line"></i>${project.location}</span>
        </div>
        <h3 class="card__title">${project.title}</h3>
        <p class="card__excerpt">${project.summary}</p>
        ${
          project.status !== "planned"
            ? `<div class="project-card__progress">
              <div class="project-card__progress-label">
                <span><i class="ri-bar-chart-line"></i> Avancement</span>
                <strong style="color:var(--color-primary)">${project.progress}%</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-bar__fill" style="width:${project.progress}%;background:${project.status === "closed" ? "#4E4E4E" : "var(--color-primary)"};"></div>
              </div>
            </div>`
            : '<div style="background:var(--color-planned-bg);color:var(--color-planned);border-radius:6px;padding:8px 12px;font-size:12px;font-weight:600;"><i class="ri-calendar-line"></i> Démarrage : ' +
              startDate +
              "</div>"
        }
      </div>
      <div class="card__footer">
        <div style="font-size:12px;color:var(--color-text-muted);">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;">
            <i class="ri-group-line" style="color:var(--color-primary)"></i>
            <strong style="color:var(--color-text)">${beneficiariesFormatted}</strong> bénéficiaires
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <i class="ri-calendar-line"></i>
            ${startDate} → ${endDate}
          </div>
        </div>
        <a href="${basePath}pages/projet-detail.html?id=${project.id}" class="btn btn--outline btn--sm">
          Voir la fiche
          <i class="ri-arrow-right-line"></i>
        </a>
      </div>
    </article>
  `;
}

/* ============================================================
   FILTRES & AFFICHAGE
   ============================================================ */
async function initProjectsPage() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const loadingEl = document.getElementById("projects-loading");
  const emptyEl = document.getElementById("projects-empty");
  const countEl = document.getElementById("projects-count");

  const projects = await window.MRJC.fetchData("projects.json");
  if (!projects) {
    if (loadingEl) loadingEl.remove();
    return;
  }

  let filtered = [...projects];
  let currentStatus = "all";
  let currentDomain = "all";

  function renderProjects() {
    if (loadingEl) loadingEl.style.display = "none";

    const displayed = filtered.sort((a, b) => {
      const order = { ongoing: 0, planned: 1, closed: 2 };
      return order[a.status] - order[b.status];
    });

    container.innerHTML = displayed.map(renderProjectCard).join("");

    if (countEl) {
      countEl.textContent = `${displayed.length} projet${displayed.length > 1 ? "s" : ""}`;
    }

    if (emptyEl) {
      emptyEl.style.display = displayed.length === 0 ? "block" : "none";
    }

    // Re-init animations
    document.querySelectorAll(".reveal").forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(el);
    });
  }

  function applyFilters() {
    filtered = projects.filter((p) => {
      const matchStatus = currentStatus === "all" || p.status === currentStatus;
      const matchDomain = currentDomain === "all" || p.domain === currentDomain;
      return matchStatus && matchDomain;
    });
    renderProjects();
  }

  // Status filters
  document.querySelectorAll("[data-filter-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter-status]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentStatus = btn.dataset.filterStatus;
      applyFilters();
    });
  });

  // Domain filters
  document.querySelectorAll("[data-filter-domain]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter-domain]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentDomain = btn.dataset.filterDomain;
      applyFilters();
    });
  });

  // Search
  const searchInput = document.getElementById("project-search");
  searchInput?.addEventListener(
    "input",
    window.MRJC.debounce((e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query) {
        filtered = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.summary.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            p.domain.toLowerCase().includes(query),
        );
      } else {
        applyFilters();
        return;
      }
      renderProjects();
    }, 300),
  );

  renderProjects();
}

/* ============================================================
   PAGE DÉTAIL PROJET
   ============================================================ */
async function initProjectDetail() {
  const container = document.getElementById("project-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = parseInt(params.get("id"));

  if (!projectId) {
    window.location.href = "interventions.html";
    return;
  }

  const projects = await window.MRJC.fetchData("projects.json");
  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;">
        <i class="ri-error-warning-line" style="font-size:3rem;color:var(--color-error)"></i>
        <h2 style="margin-top:1rem;">Projet introuvable</h2>
        <p style="color:var(--color-text-muted);margin:1rem 0;">Ce projet n'existe pas ou a été supprimé.</p>
        <a href="interventions.html" class="btn btn--primary">Voir tous les projets</a>
      </div>`;
    return;
  }

  // Update page title
  document.title = `${project.title} | MRJC-BÉNIN`;

  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.ongoing;
  const domain = DOMAIN_CONFIG[project.domain] || DOMAIN_CONFIG.agriculture;
  const beneficiariesFormatted = window.MRJC.formatNumber(
    project.beneficiaries,
  );

  // Breadcrumb
  const breadcrumb = document.querySelector(
    ".page-banner__breadcrumb span:last-child",
  );
  if (breadcrumb) breadcrumb.textContent = project.title;

  // Page banner title
  const bannerTitle = document.querySelector(".page-banner__title");
  if (bannerTitle) bannerTitle.textContent = project.title;

  container.innerHTML = `
    <!-- Hero image -->
    <div style="border-radius:var(--radius-2xl);overflow:hidden;margin-bottom:var(--space-8);position:relative;">
      <img src="${project.thumbnail}" alt="${project.title}" style="width:100%;height:360px;object-fit:cover;display:block;" />
      <div style="position:absolute;top:1rem;left:1rem;display:flex;gap:.5rem;flex-wrap:wrap;">
        <span class="badge ${status.badge}"><i class="${status.icon}"></i> ${status.label}</span>
        <span class="badge" style="background:${domain.bg};color:${domain.color}"><i class="${domain.icon}"></i> ${domain.label}</span>
      </div>
    </div>

    <!-- Meta info row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-bottom:2rem;">
      ${[
        {
          icon: "ri-map-pin-line",
          label: "Zone d'intervention",
          value: project.location,
        },
        {
          icon: "ri-group-line",
          label: "Bénéficiaires",
          value: `${beneficiariesFormatted} pers.`,
        },
        {
          icon: "ri-money-dollar-circle-line",
          label: "Budget",
          value: project.budget,
        },
        { icon: "ri-building-line", label: "Bailleur", value: project.donor },
        {
          icon: "ri-calendar-line",
          label: "Début",
          value: window.MRJC.formatDate(project.startDate),
        },
        {
          icon: "ri-calendar-check-line",
          label: "Fin",
          value: project.endDate
            ? window.MRJC.formatDate(project.endDate)
            : "En cours",
        },
      ]
        .map(
          (m) => `
        <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:1rem;">
          <div style="display:flex;align-items:center;gap:.5rem;color:var(--color-text-muted);font-size:12px;margin-bottom:.25rem;">
            <i class="${m.icon}" style="color:var(--color-primary)"></i> ${m.label}
          </div>
          <div style="font-weight:700;font-size:14px;color:var(--color-text)">${m.value}</div>
        </div>`,
        )
        .join("")}
    </div>

    <!-- Progress -->
    ${
      project.status !== "planned"
        ? `
      <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);padding:1.5rem;margin-bottom:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h3 style="font-size:1rem;font-weight:700;margin:0">Avancement du projet</h3>
          <span style="font-size:1.5rem;font-weight:800;color:var(--color-primary)">${project.progress}%</span>
        </div>
        <div class="progress-bar" style="height:12px;">
          <div class="progress-bar__fill" data-target="${project.progress}" style="width:0%;background:${project.status === "closed" ? "var(--color-closed)" : "var(--color-primary)"}"></div>
        </div>
        ${project.status === "closed" ? '<p style="font-size:12px;color:var(--color-text-muted);margin-top:.75rem;"><i class="ri-check-double-line" style="color:var(--color-success)"></i> Projet clôturé avec succès</p>' : ""}
      </div>`
        : ""
    }

    <!-- Description -->
    <div style="margin-bottom:2rem;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:1rem;">À propos du projet</h2>
      <p style="font-size:1rem;line-height:1.75;color:var(--color-text-muted)">${project.description}</p>
    </div>

    <!-- Objectifs / Résultats -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem;">
      <div style="background:var(--color-primary-50);border:1px solid var(--color-primary-100);border-radius:var(--radius-xl);padding:1.5rem;">
        <h3 style="font-size:1rem;font-weight:800;color:var(--color-primary);margin-bottom:1rem;">
          <i class="ri-focus-3-line"></i> Objectifs
        </h3>
        <ul style="list-style:none;padding:0;margin:0;">
          ${project.objectives
            .map(
              (obj) => `
            <li style="display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.75rem;font-size:.875rem;line-height:1.5;">
              <i class="ri-checkbox-circle-line" style="color:var(--color-primary);flex-shrink:0;margin-top:2px;font-size:16px;"></i>
              ${obj}
            </li>`,
            )
            .join("")}
        </ul>
      </div>
      <div style="background:var(--color-secondary-50);border:1px solid var(--color-secondary-100);border-radius:var(--radius-xl);padding:1.5rem;">
        <h3 style="font-size:1rem;font-weight:800;color:var(--color-secondary);margin-bottom:1rem;">
          <i class="ri-bar-chart-box-line"></i> Résultats ${project.status === "ongoing" ? "à ce jour" : "obtenus"}
        </h3>
        ${
          project.results.length > 0
            ? `<ul style="list-style:none;padding:0;margin:0;">
              ${project.results
                .map(
                  (res) => `
                <li style="display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.75rem;font-size:.875rem;line-height:1.5;">
                  <i class="ri-arrow-right-circle-fill" style="color:var(--color-secondary);flex-shrink:0;margin-top:2px;font-size:16px;"></i>
                  ${res}
                </li>`,
                )
                .join("")}
            </ul>`
            : '<p style="color:var(--color-text-muted);font-size:.875rem;font-style:italic;">Résultats en attente — projet non démarré</p>'
        }
      </div>
    </div>

    <!-- Partenaires -->
    <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);padding:1.5rem;margin-bottom:2rem;">
      <h3 style="font-size:1rem;font-weight:800;margin-bottom:1rem;"><i class="ri-handshake-line" style="color:var(--color-accent)"></i> Partenaires du projet</h3>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
        ${project.partners.map((p) => `<span class="tag">${p}</span>`).join("")}
      </div>
    </div>

    <!-- Galerie -->
    ${
      project.gallery?.length > 0
        ? `
      <div>
        <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:1rem;"><i class="ri-image-line" style="color:var(--color-primary)"></i> Galerie photos</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;">
          ${project.gallery
            .map(
              (img, i) => `
            <div style="border-radius:var(--radius-lg);overflow:hidden;cursor:zoom-in;position:relative;"
                 data-gallery="project-${project.id}"
                 data-src="${img.url}"
                 data-caption="${img.caption}">
              <img src="${img.url}" alt="${img.caption}" loading="lazy"
                   style="width:100%;height:180px;object-fit:cover;display:block;transition:transform .4s ease;"
                   onmouseover="this.style.transform='scale(1.05)'"
                   onmouseout="this.style.transform='scale(1)'" />
              <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.7));padding:1rem .75rem .75rem;color:white;font-size:12px;">
                ${img.caption}
              </div>
            </div>`,
            )
            .join("")}
        </div>
      </div>`
        : ""
    }
  `;

  // Animate progress bar
  setTimeout(() => {
    const fill = container.querySelector(".progress-bar__fill");
    if (fill) fill.style.width = fill.dataset.target + "%";
  }, 300);
}

/* ============================================================
   PROJETS EN PAGE D'ACCUEIL (featured)
   ============================================================ */
async function initFeaturedProjects() {
  const container = document.getElementById("featured-projects");
  if (!container) return;

  const projects = await window.MRJC.fetchData("projects.json");
  if (!projects) return;

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  container.innerHTML = featured.map(renderProjectCard).join("");
}

/* ============================================================
   GALERIE D'UN PROJET (depuis bouton sur carte)
   ============================================================ */
async function openProjectGallery(projectId) {
  const projects = await window.MRJC.fetchData("projects.json");
  const project = projects?.find((p) => p.id === projectId);
  if (!project?.gallery?.length) return;
  window.openLightbox?.(project.gallery, 0);
}

window.openProjectGallery = openProjectGallery;

/* ============================================================
   STATISTIQUES PROJETS (pour sidebar ou accueil)
   ============================================================ */
async function initProjectStats() {
  const statsEl = document.getElementById("project-stats");
  if (!statsEl) return;

  const projects = await window.MRJC.fetchData("projects.json");
  if (!projects) return;

  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const closed = projects.filter((p) => p.status === "closed").length;
  const planned = projects.filter((p) => p.status === "planned").length;
  const total = projects.length;

  statsEl.innerHTML = `
    <div class="sidebar__widget-title"><i class="ri-pie-chart-line"></i> Nos projets en chiffres</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
      ${[
        {
          value: total,
          label: "Total",
          color: "var(--color-text)",
          bg: "var(--color-bg)",
        },
        {
          value: ongoing,
          label: "En cours",
          color: "var(--color-ongoing)",
          bg: "var(--color-ongoing-bg)",
        },
        {
          value: closed,
          label: "Clôturés",
          color: "var(--color-closed)",
          bg: "var(--color-closed-bg)",
        },
        {
          value: planned,
          label: "Planifiés",
          color: "var(--color-planned)",
          bg: "var(--color-planned-bg)",
        },
      ]
        .map(
          (s) => `
        <div style="text-align:center;background:${s.bg};border-radius:var(--radius-lg);padding:.75rem;border:1px solid ${s.color}20;">
          <div style="font-size:1.75rem;font-weight:800;color:${s.color};line-height:1">${s.value}</div>
          <div style="font-size:11px;color:var(--color-text-muted);font-weight:600;margin-top:4px;">${s.label}</div>
        </div>`,
        )
        .join("")}
    </div>
  `;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initProjectsPage();
  initProjectDetail();
  initFeaturedProjects();
  initProjectStats();
});
