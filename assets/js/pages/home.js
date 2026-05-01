const copy = window.EVERWILD_HOME_COPY || {};

const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const staticForm = document.querySelector(".contact-form");
const placeholderNodes = Array.from(document.querySelectorAll("[data-i18n-placeholder]"));
const originalPlaceholders = new Map(placeholderNodes.map((node) => [node, node.getAttribute("placeholder") || ""]));
let currentBundle = copy.zh;

createSiteI18n({
  copy,
  onApply: ({ bundle }) => {
    currentBundle = bundle;
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
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNav = () => {
  if (!header || !navToggle) {
    return;
  }

  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const syncCurrentNav = (activeId) => {
  navLinks.forEach((link) => {
    const linkId = link.getAttribute("href")?.replace(/^#/, "");
    const isCurrent = Boolean(activeId) && linkId === activeId;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
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

if (navToggle && navPanel) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("nav-open");
    header.classList.toggle("nav-open", !isOpen);
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.replace(/^#/, "");
      if (id) {
        syncCurrentNav(id);
      }
      closeNav();
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("nav-open")) {
      return;
    }

    if (!header.contains(event.target)) {
      closeNav();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeNav();
    }
  });
}

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

if (staticForm) {
  staticForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!staticForm.reportValidity()) {
      return;
    }

    const formData = new FormData(staticForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const optionLabel = staticForm.querySelector(`option[value="${interest}"]`)?.textContent?.trim() || interest;
    const targetEmail = staticForm.dataset.contactEmail || "everwild.global@gmail.com";
    const subject = ["EVERWILD", optionLabel, name || contact].filter(Boolean).join(" / ");
    const labels = {
      name: currentBundle?.formNameLabel || "Name",
      contact: currentBundle?.formContactLabel || "Contact",
      interest: currentBundle?.formInterestLabel || "Interest",
      message: currentBundle?.formMessageLabel || "Message"
    };
    const body = [
      `${labels.name}: ${name}`,
      `${labels.contact}: ${contact}`,
      `${labels.interest}: ${optionLabel}`,
      `${labels.message}:`,
      message
    ].join("\n");

    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

window.addEventListener("scroll", scheduleScrollSync, { passive: true });
window.addEventListener("resize", scheduleScrollSync);
scheduleScrollSync();
