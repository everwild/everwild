if (window.createSiteI18n && window.EVERWILD_NAV_COPY) {
  window.createSiteI18n({ copy: window.EVERWILD_NAV_COPY });
}

const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const fujiForm = document.querySelector("[data-fuji-form]");

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

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const nextState = !header.classList.contains("nav-open");
    header.classList.toggle("nav-open", nextState);
    navToggle.setAttribute("aria-expanded", String(nextState));
  });

  document.addEventListener("click", (event) => {
    if (header.classList.contains("nav-open") && !header.contains(event.target)) {
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

const navSections = navLinks
  .map((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) {
      return null;
    }

    const section = document.getElementById(href.slice(1));
    return section ? { link, section, id: href.slice(1) } : null;
  })
  .filter(Boolean);

const syncCurrentNav = () => {
  if (!navSections.length) {
    return;
  }

  const offset = (header?.offsetHeight || 0) + Math.min(window.innerHeight * 0.18, 140);
  const marker = window.scrollY + offset;
  let activeId = navSections[0].id;

  navSections.forEach(({ id, section }) => {
    if (section.offsetTop <= marker) {
      activeId = id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
    activeId = navSections[navSections.length - 1].id;
  }

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
  });
});

let scrollSyncPending = false;
const scheduleScrollSync = () => {
  if (scrollSyncPending) {
    return;
  }

  scrollSyncPending = true;
  window.requestAnimationFrame(() => {
    syncHeader();
    syncCurrentNav();
    scrollSyncPending = false;
  });
};

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
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.05
  });

  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

if (fujiForm) {
  fujiForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!fujiForm.reportValidity()) {
      return;
    }

    const data = new FormData(fujiForm);
    const targetEmail = fujiForm.dataset.contactEmail || "everwild.global@gmail.com";
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const participants = String(data.get("participants") || "").trim();
    const month = String(data.get("month") || "").trim();
    const experience = String(data.get("experience") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = ["2026 EVERWILD 富士山登山招募", month, name || contact].filter(Boolean).join(" / ");
    const body = [
      "2026 EVERWILD 富士山登山报名意向",
      "",
      `姓名：${name}`,
      `联系方式：${contact}`,
      `参加人数：${participants}`,
      `希望月份：${month}`,
      `登山 / 徒步经验：${experience}`,
      "",
      "备注：",
      message || "无",
      "",
      `页面：${window.location.href}`
    ].join("\n");

    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

window.addEventListener("scroll", scheduleScrollSync, { passive: true });
window.addEventListener("resize", scheduleScrollSync);
scheduleScrollSync();
