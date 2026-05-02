/**
 * Shared header scroll state + mobile navigation (toggle, outside click, Escape, resize).
 */
window.syncSiteHeaderScrolled = (headerEl) => {
  const header = headerEl || document.querySelector("[data-site-header]");
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.initSiteNav = (options = {}) => {
  const breakpointWidth = options.breakpointWidth ?? 860;
  const header = options.header ?? document.querySelector("[data-site-header]");
  const navToggle = options.navToggle ?? document.querySelector("[data-nav-toggle]");
  const navPanel = options.navPanel ?? document.querySelector("[data-nav-panel]");
  const navLinks = options.navLinks ?? Array.from(document.querySelectorAll("[data-nav-link]"));
  const onNavLinkActivate = options.onNavLinkActivate;

  if (!header || !navToggle || !navPanel) {
    return {
      closeNav: () => {},
      isOpen: () => false
    };
  }

  const isDisplayedFocusable = (el) => {
    if (el.disabled) {
      return false;
    }

    const style = window.getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") {
      return false;
    }

    return el.getClientRects().length > 0;
  };

  const getPanelFocusables = () =>
    Array.from(
      navPanel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      )
    ).filter(isDisplayedFocusable);

  const closeNav = (opts = {}) => {
    const restoreFocus = Boolean(opts.restoreFocus);
    if (!header.classList.contains("nav-open")) {
      return;
    }

    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      navToggle.focus();
    }
  };

  const focusFirstPanelControl = () => {
    window.requestAnimationFrame(() => {
      const items = getPanelFocusables();
      if (items.length) {
        items[0].focus();
      }
    });
  };

  document.addEventListener("keydown", (event) => {
    if (!header.classList.contains("nav-open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeNav({ restoreFocus: true });
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const items = getPanelFocusables();
    if (items.length === 0) {
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !header.classList.contains("nav-open");

    if (willOpen) {
      header.classList.add("nav-open");
      navToggle.setAttribute("aria-expanded", "true");
      focusFirstPanelControl();
      return;
    }

    closeNav({ restoreFocus: true });
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("nav-open")) {
      return;
    }

    if (!header.contains(event.target)) {
      closeNav({ restoreFocus: true });
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > breakpointWidth) {
      closeNav({ restoreFocus: false });
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof onNavLinkActivate === "function") {
        onNavLinkActivate(link);
      }
      closeNav({ restoreFocus: false });
    });
  });

  return {
    closeNav,
    isOpen: () => header.classList.contains("nav-open")
  };
};
