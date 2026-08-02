(() => {
  const textDefaults = Object.fromEntries(
    [...document.querySelectorAll("[data-i18n]")].map((element) => [
      element.dataset.i18n,
      element.textContent
    ])
  );
  const htmlDefaults = Object.fromEntries(
    [...document.querySelectorAll("[data-i18n-html]")].map((element) => [
      element.dataset.i18nHtml,
      element.innerHTML
    ])
  );
  const labelDefaults = Object.fromEntries(
    [...document.querySelectorAll("[data-i18n-aria-label]")].map((element) => [
      element.dataset.i18nAriaLabel,
      element.getAttribute("aria-label") || ""
    ])
  );

  const translations = window.PAGE_TRANSLATIONS || {};
  const storageKey = document.body.dataset.storageKey || `appPageLanguage:${location.pathname}`;

  function savedLanguage() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function rememberLanguage(language) {
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      // Private browsing or disabled storage should not break language switching.
    }
  }

  function setMeta(meta = {}) {
    if (meta.title) document.title = meta.title;

    const description = document.getElementById("meta-description");
    if (description && meta.description) description.setAttribute("content", meta.description);

    const ogTitle = document.getElementById("og-title");
    if (ogTitle && (meta.ogTitle || meta.title)) {
      ogTitle.setAttribute("content", meta.ogTitle || meta.title);
    }

    const ogDescription = document.getElementById("og-description");
    if (ogDescription && (meta.ogDescription || meta.description)) {
      ogDescription.setAttribute("content", meta.ogDescription || meta.description);
    }

    if (meta.storeUrl) {
      document.querySelectorAll("[data-store-link]").forEach((element) => {
        element.setAttribute("href", meta.storeUrl);
      });
    }
  }

  function applyLanguage(language) {
    const selected = translations[language] ? language : "ja";
    const translation = translations[selected] || {};

    document.documentElement.lang = selected;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = translation.text?.[key] ?? textDefaults[key] ?? "";
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const key = element.dataset.i18nHtml;
      element.innerHTML = translation.html?.[key] ?? htmlDefaults[key] ?? "";
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      element.setAttribute("aria-label", translation.labels?.[key] ?? labelDefaults[key] ?? "");
    });

    setMeta(translation.meta);
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === selected));
    });
    rememberLanguage(selected);
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

  applyLanguage(savedLanguage() || document.documentElement.lang || "ja");
})();
