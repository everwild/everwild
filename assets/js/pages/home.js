const copy = window.EVERWILD_HOME_COPY || {};

const header = document.querySelector("[data-site-header]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const placeholderNodes = Array.from(document.querySelectorAll("[data-i18n-placeholder]"));
const originalPlaceholders = new Map(placeholderNodes.map((node) => [node, node.getAttribute("placeholder") || ""]));

createSiteI18n({
  copy,
  onApply: ({ bundle }) => {
    placeholderNodes.forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      node.setAttribute("placeholder", key in bundle ? bundle[key] : (originalPlaceholders.get(node) || ""));
    });
  }
});

const navSections = navLinks
  .map((link) => {
    const id = link.getAttribute("href")?.replace(/^#/, "");
    const section = id ? document.getElementById(id) : null;
    return section ? { id, link, section } : null;
  })
  .filter(Boolean);

const syncHeader = () => {
  syncSiteHeaderScrolled(header);
};

const syncCurrentNav = (activeId) => {
  navLinks.forEach((link) => {
    const linkId = link.getAttribute("href")?.replace(/^#/, "");
    const isCurrent = Boolean(activeId) && linkId === activeId;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

document.querySelectorAll(
  ".brand-grid, .gateway-grid, .activity-grid, .story-grid, .schedule-grid, .benefit-grid, .course-grid, .media-grid, .channel-band, .about-grid, .join-grid"
).forEach((group) => {
  Array.from(group.children).forEach((node, index) => {
    if (node.hasAttribute("data-reveal")) {
      node.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 55}ms`);
    }
  });
});

const getActiveSectionId = () => {
  if (!navSections.length) {
    return "";
  }

  const headerOffset = header?.offsetHeight || 0;
  const scrollMarker = window.scrollY + headerOffset + Math.min(window.innerHeight * 0.18, 150);
  let activeId = navSections[0].id;

  navSections.forEach(({ id, section }) => {
    if (section.offsetTop <= scrollMarker) {
      activeId = id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
    return navSections[navSections.length - 1].id;
  }

  return activeId;
};

let scrollSyncPending = false;
const scheduleScrollSync = () => {
  if (scrollSyncPending) {
    return;
  }

  scrollSyncPending = true;
  window.requestAnimationFrame(() => {
    syncHeader();
    syncCurrentNav(getActiveSectionId());
    scrollSyncPending = false;
  });
};

initSiteNav({
  header,
  navLinks,
  onNavLinkActivate(link) {
    const id = link.getAttribute("href")?.replace(/^#/, "");
    if (id) {
      syncCurrentNav(id);
    }
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

window.addEventListener("scroll", scheduleScrollSync, { passive: true });
window.addEventListener("resize", scheduleScrollSync);
scheduleScrollSync();
