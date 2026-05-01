const legalHeader = document.querySelector("[data-site-header]");
const legalNavToggle = document.querySelector("[data-nav-toggle]");
const legalNavPanel = document.querySelector("[data-nav-panel]");
const legalNavLinks = document.querySelectorAll("[data-nav-link]");

const syncLegalHeader = () => {
  if (!legalHeader) {
    return;
  }

  legalHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeLegalNav = () => {
  if (!legalHeader || !legalNavToggle) {
    return;
  }

  legalHeader.classList.remove("nav-open");
  legalNavToggle.setAttribute("aria-expanded", "false");
};

if (legalNavToggle && legalNavPanel) {
  legalNavToggle.addEventListener("click", () => {
    const isOpen = legalHeader.classList.contains("nav-open");
    legalHeader.classList.toggle("nav-open", !isOpen);
    legalNavToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  legalNavLinks.forEach((link) => link.addEventListener("click", closeLegalNav));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLegalNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeLegalNav();
    }
  });
}

window.addEventListener("scroll", syncLegalHeader, { passive: true });
syncLegalHeader();
