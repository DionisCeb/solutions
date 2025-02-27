$(document).ready(function () {
  const availableLocales = ["en", "fr"];
  const defaultLanguage = "fr"; // Langue par défaut

  // Charger le fichier JSON de traduction
  const loadLocale = (lang) => {
    return $.getJSON(`../../locales/${lang}.json`);
  };

  // Appliquer les traductions
  const applyTranslations = (translations) => {
    $("[data-lang]").each(function () {
      const key = $(this).data("lang"); // Clé de traduction
      let text = key
        .split(".")
        .reduce((obj, i) => (obj ? obj[i] : null), translations);

      if (text) {
        const variables = text.match(/{(.*?)}/g);
        if (variables) {
          variables.forEach((variable) => {
            Object.entries($(this).data()).forEach(([key, value]) => {
              if (`{${key}}` === variable) {
                try {
                  text = text.replace(
                    `${variable}`,
                    new Function(`return (${value})`)()
                  );
                } catch (error) {
                  text = text.replace(`${variable}`, value);
                }
              }
            });
          });
        }

        // Si l'élément a un attribut placeholder, l'utiliser pour traduire le placeholder
        if ($(this).is("input") || $(this).is("textarea")) {
          $(this).attr("placeholder", text);
        } else {
          $(this).html(text); // Sinon, traduire le texte HTML

        }
      }
    });

    $("html").attr("lang", pageLanguage);
  };

  // Changer de langue
  const changeLanguage = (lang) => {
    if (availableLocales.includes(lang)) {
      localStorage.setItem("language", lang);
      window.location.reload();
    }
  };

  // Afficher ou cacher les boutons de langue
  const updateButtonVisibility = () => {
    const currentLang = localStorage.getItem("language") || defaultLanguage;
    if (currentLang === "fr") {
      $("#lang-fr").hide();
      $("#lang-en").show();
    } else {
      $("#lang-fr").show();
      $("#lang-en").hide();
    }
  };

  $("#lang-fr").on("click", () => changeLanguage("fr"));
  $("#lang-en").on("click", () => changeLanguage("en"));

  // Charger la langue depuis le localStorage ou le navigateur
  let language =
    localStorage.getItem("language") ||
    (window.navigator.userLanguage || window.navigator.language).substr(0, 2);

  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get("lang");
  if (langFromUrl && availableLocales.includes(langFromUrl)) {
    language = langFromUrl;
    localStorage.setItem("language", language);
  }

  let pageLanguage = availableLocales.includes(language)
    ? language
    : defaultLanguage;

  updateButtonVisibility();
  loadLocale(pageLanguage).done(applyTranslations);
});
