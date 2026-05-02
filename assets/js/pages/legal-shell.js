if (
  document.body.dataset.shell === "nav-only" &&
  window.createSiteI18n &&
  window.EVERWILD_NAV_COPY
) {
  window.createSiteI18n({ copy: window.EVERWILD_NAV_COPY });
}

const legalHeader = document.querySelector("[data-site-header]");
const legalNavLinks = Array.from(document.querySelectorAll("[data-nav-link]"));

const syncLegalHeader = () => {
  syncSiteHeaderScrolled(legalHeader);
};

initSiteNav({
  header: legalHeader,
  navLinks: legalNavLinks
});

window.addEventListener("scroll", syncLegalHeader, { passive: true });
syncLegalHeader();
