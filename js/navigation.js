(function () {
  function updateActiveLinks() {
    // Sélectionne tous les liens de navigation dans l'en-tête et le pied de page
    const navLinks = document.querySelectorAll(
      ".footer-section.navigation ul li a, .header nav ul li a"
    );

    if (navLinks.length > 0) {
      navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        if (window.location.pathname === linkPath) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    } else {
    }
  }

  // Exécute la fonction une fois que le DOM est entièrement chargé
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateActiveLinks);
  } else {
    updateActiveLinks();
  }
})();
