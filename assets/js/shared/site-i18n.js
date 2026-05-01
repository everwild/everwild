window.createSiteI18n = ({ copy, onApply }) => {
  const langButtons = Array.from(document.querySelectorAll("[data-lang-toggle]"));
  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const i18nHtmlNodes = Array.from(document.querySelectorAll("[data-i18n-html]"));
  const originalNodeText = new Map(i18nNodes.map((element) => [element, element.textContent]));
  const originalHtml = new Map(i18nHtmlNodes.map((element) => [element, element.innerHTML]));
  const preferredDocumentLanguage = (document.documentElement.lang || "").toLowerCase();
  const defaultLanguage = preferredDocumentLanguage.startsWith("zh") && copy.zh
    ? "zh"
    : (copy.ja ? "ja" : (copy.en ? "en" : "zh"));
  const langMap = {
    ja: "ja-JP",
    en: "en",
    zh: "zh-CN"
  };
  const isApplePlatform = (() => {
    const userAgent = navigator.userAgent || "";
    const platform = navigator.platform || "";
    return /Mac|iPhone|iPad|iPod/i.test(userAgent) || /Mac/i.test(platform);
  })();
  let currentLanguage = defaultLanguage;

  if (isApplePlatform) {
    document.documentElement.dataset.platform = "apple";
  } else {
    document.documentElement.removeAttribute("data-platform");
  }

  const applyLanguage = (language) => {
    currentLanguage = language in copy ? language : defaultLanguage;
    const bundle = copy[currentLanguage] || copy[defaultLanguage] || copy.zh || copy.en || copy.ja;
    document.documentElement.lang = langMap[currentLanguage] || langMap[defaultLanguage] || "en";

    if (bundle.pageTitle) {
      document.title = bundle.pageTitle;
    }

    i18nNodes.forEach((element) => {
      const key = element.dataset.i18n;
      if (!(key in bundle)) {
        if (originalNodeText.has(element)) {
          element.textContent = originalNodeText.get(element);
        }
        return;
      }

      const value = bundle[key];
      if (typeof value === "string" && value.includes("<")) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    });

    i18nHtmlNodes.forEach((element) => {
      const key = element.dataset.i18nHtml;
      if (key in bundle) {
        element.innerHTML = bundle[key];
      } else if (originalHtml.has(element)) {
        element.innerHTML = originalHtml.get(element);
      }
    });

    langButtons.forEach((button) => {
      const isActive = button.dataset.langToggle === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (typeof onApply === "function") {
      onApply({ language: currentLanguage, bundle });
    }

    try {
      localStorage.setItem("site-language", currentLanguage);
    } catch (error) {
      console.debug("Language preference could not be stored.", error);
    }
  };

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.langToggle);
    });
  });

  let savedLanguage = defaultLanguage;

  try {
    savedLanguage = localStorage.getItem("site-language") || defaultLanguage;
  } catch (error) {
    console.debug("Language preference could not be read.", error);
  }

  applyLanguage(savedLanguage in copy ? savedLanguage : defaultLanguage);

  return {
    get language() {
      return currentLanguage;
    },
    applyLanguage
  };
};

window.initLegalPage = (copy) => window.createSiteI18n({ copy });
