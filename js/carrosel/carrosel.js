document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const items = Array.from(carousel.querySelectorAll(".carousel-item"));
  const buttonPrev = document.querySelector(".carousel-button.prev");
  const buttonNext = document.querySelector(".carousel-button.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  let itemsPerView = 3;

  // Crée une boucle infinie en clonant les éléments du carousel
  function createInfiniteLoop() {
    const totalItems = items.length;
    const startClones = items
      .slice(-itemsPerView)
      .map((item) => item.cloneNode(true));
    const endClones = items
      .slice(0, itemsPerView)
      .map((item) => item.cloneNode(true));
    startClones.forEach((clone) =>
      carousel.insertBefore(clone, carousel.firstChild)
    );
    endClones.forEach((clone) => carousel.appendChild(clone));
    return Array.from(carousel.querySelectorAll(".carousel-item"));
  }

  const allItems = createInfiniteLoop();

  // Crée les points pour la navigation
  items.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Met à jour le carousel en fonction de l'index actuel
  function updateCarousel(disableTransition = false) {
    const itemWidth = 100 / itemsPerView;
    const offset = (currentIndex + itemsPerView) * itemWidth;

    if (disableTransition) {
      carousel.style.transition = "none";
    } else {
      carousel.style.transition = "transform 0.5s ease-in-out";
    }

    carousel.style.transform = `translateX(-${offset}%)`;
    updateActiveItem();
    updateDots();

    if (disableTransition) {
      // Force un reflow avant de réactiver la transition
      carousel.offsetHeight;
      carousel.style.transition = "transform 0.5s ease-in-out";
    }
  }

  // Met à jour l'élément actif du carousel
  function updateActiveItem() {
    const middleIndex = Math.floor(itemsPerView / 2);
    allItems.forEach((item, index) => {
      item.classList.toggle(
        "active",
        index - itemsPerView === currentIndex + middleIndex
      );
    });
  }

  // Met à jour les points de navigation
  function updateDots() {
    const totalDots = items.length;
    dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex % totalDots);
    });
  }

  // Va à un slide spécifique
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex++;
    updateCarousel();

    if (currentIndex > items.length - 1) {
      setTimeout(() => {
        currentIndex = 0;
        updateCarousel(true);
      }, 500); // Attendre que la transition se termine
    }
  }


  function prevSlide() {
    currentIndex--;
    updateCarousel();

    if (currentIndex < 0) {
      setTimeout(() => {
        currentIndex = items.length - 1;
        updateCarousel(true);
      }, 500); // Attendre que la transition se termine
    }
  }

  buttonPrev.addEventListener("click", prevSlide);
  buttonNext.addEventListener("click", nextSlide);

  // Ajuste le nombre d'éléments affichés en fonction de la taille de l'écran
  function adjustItemsPerView() {
    if (window.innerWidth <= 768) {
      itemsPerView = 1;
    } else if (window.innerWidth <= 1024) {
      itemsPerView = 2;
    } else {
      itemsPerView = 3;
    }
    updateCarousel(true);
  }

  window.addEventListener("resize", adjustItemsPerView);
  adjustItemsPerView();
  updateCarousel();
});
