/* ── i18n ── */
if (window.createSiteI18n && window.EVERWILD_FUJI_COPY) {
  window.createSiteI18n({
    copy: window.EVERWILD_FUJI_COPY,
    onApply({ bundle }) {
      /* meta description */
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && bundle.metaDesc) {
        metaDesc.setAttribute("content", bundle.metaDesc);
      }

      /* placeholder attributes */
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (bundle[key]) el.setAttribute("placeholder", bundle[key]);
      });

      /* aria-label attributes */
      document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.dataset.i18nAriaLabel;
        if (bundle[key]) el.setAttribute("aria-label", bundle[key]);
      });

      /* img alt attributes */
      document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
        const key = el.dataset.i18nAlt;
        if (bundle[key]) el.setAttribute("alt", bundle[key]);
      });
    }
  });
}

/* ── Header & nav ── */
const header   = document.querySelector("[data-site-header]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));

const syncHeader = () => {
  syncSiteHeaderScrolled(header);
};

initSiteNav({ header, navLinks });

/* ── Scroll-linked nav highlight ── */
const navSections = navLinks
  .map((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return null;
    const section = document.getElementById(href.slice(1));
    return section ? { link, section, id: href.slice(1) } : null;
  })
  .filter(Boolean);

const syncCurrentNav = () => {
  if (!navSections.length) return;

  const offset   = (header?.offsetHeight || 0) + Math.min(window.innerHeight * 0.18, 140);
  const marker   = window.scrollY + offset;
  let   activeId = navSections[0].id;

  navSections.forEach(({ id, section }) => {
    if (section.offsetTop <= marker) activeId = id;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
    activeId = navSections[navSections.length - 1].id;
  }

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

/* ── Scroll performance ── */
let scrollSyncPending = false;
const scheduleScrollSync = () => {
  if (scrollSyncPending) return;
  scrollSyncPending = true;
  window.requestAnimationFrame(() => {
    syncHeader();
    syncCurrentNav();
    scrollSyncPending = false;
  });
};

/* ── Reveal animations ── */
document.querySelectorAll("[data-reveal]").forEach((node, index) => {
  node.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 45}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

window.addEventListener("scroll", scheduleScrollSync, { passive: true });
window.addEventListener("resize", scheduleScrollSync);
scheduleScrollSync();
