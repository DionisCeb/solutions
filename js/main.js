document.addEventListener("DOMContentLoaded", function () {
  const etapeNumbers = document.querySelectorAll(".etape-number");
  const cards = document.querySelectorAll(".etapes-card .card");
  const etapesSection = document.querySelector(".etapes");
  let hasScrolled = false;
  let lastActiveIndex = -1; 

  // Fonction pour vérifier si l'élément est visible 
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < windowHeight &&
      rect.left < windowWidth
    );
  }

  // Fonction de gestion du scroll
  function handleScroll() {
    if (!hasScrolled && isInViewport(etapesSection)) {
      setTimeout(() => {
        etapeNumbers.forEach((number, index) => {
          setTimeout(() => {
            // Supprime la classe active du dernier card actif
            if (lastActiveIndex >= 0 && lastActiveIndex !== index) {
              cards[lastActiveIndex].classList.remove("active");
            }
            
            // Ajoute la classe active au numéro et au card actuel
            etapeNumbers[index].classList.add("active");
            cards[index].classList.add("active");

            // Met à jour l'index du dernier card actif
            lastActiveIndex = index;
            if (index === etapeNumbers.length - 1) {
              setTimeout(() => {
                cards[lastActiveIndex].classList.remove("active");
              }, 2000); 
            }
          }, index * 2000);
        });
      }, 1000); // Délai de 1 seconde avant de commencer à ajouter les classes
      hasScrolled = true;
    }
  }

  window.addEventListener("scroll", handleScroll);
});
