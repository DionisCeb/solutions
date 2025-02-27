$(function () {
  $("#footer").load("../../components/footer.html", function () {
    const data = {
      quebec: {
        Rive_sud: [
          "Longueuil",
          "Brossard",
          "Saint-Hubert",
          "Boucherville",
          "La Prairie",
          "Candiac",
          "Saint-Lambert",
          "Sainte-Catherine",
          "Delson",
          "Saint-Constant",
        ],
        Laval: [
          "Chomedey",
          "Laval-des-Rapides",
          "Sainte-Dorothée",
          "Fabreville",
          "Duvernay",
          "Pont-Viau",
          "Vimont",
          "Saint-François",
          "Sainte-Rose",
          "Auteuil",
        ],
        Montreal: [
          "Montréal-Est",
          "Outremont",
          "Montréal-Ouest",
          "Villeray-Saint-Michel-Parc-Extension",
          "Verdun",
          "Ahuntsic",
          "Westmount",
          "Rosemont-La Petite-Patrie",
          "Plateau Mont-Royal",
          "Côte-des-Neiges-Notre-Dame-de-Grâce",
        ],
        Laurentides: [
          "Saint-Jérôme",
          "Blainville",
          "Saint-Sauveur",
          "Sainte-Adèle",
          "Mirabel",
          "Boisbriand",
          "Rosemère",
          "Sainte-Thérèse",
          "Deux-Montagnes",
          "Mont-Tremblant",
        ],
        Lanaudière: [
          "L'Épiphanie",
          "Saint-Charles-Borromée",
          "Joliette",
          "Saint-Félix-de-Valois",
          "Rawdon",
          "Repentigny",
          "Terrebonne",
          "Mascouche",
          "L'Assomption",
          "Notre-Dame-des-Prairies",
        ],
      },
    };

    const regions = Object.keys(data.quebec);
    let currentRegionIndex = 0;
    let swiperCities;
    let swiperTitle;

    function loadRegion(regionIndex) {
      const regionName = regions[regionIndex];
      const cities = data.quebec[regionName];
      const regionTitleElement = document.querySelector(".region-title");
      const swiperWrapper = document.querySelector(".swiper-wrapper");

      if (!regionTitleElement || !swiperWrapper) {
        console.error(
          "Elements not found. regionTitle:",
          regionTitleElement,
          "swiperWrapper:",
          swiperWrapper
        );
        return;
      }

      regionTitleElement.textContent = regionName.replace(/_/g, " ");
      swiperWrapper.innerHTML = "";

      cities.forEach((city) => {
        swiperWrapper.innerHTML += `
          <div class="swiper-slide">${city}</div>
        `;
      });

      if (swiperCities) {
        swiperCities.destroy();
      }
      if (swiperTitle) {
        swiperTitle.destroy();
      }
      // Vérifier si la région actuelle est Montréal pour modifier le nombre de slide
      const slidesPerViewConfig = regionName === "Montreal" ? 4 : 5;

      swiperCities = new Swiper(".swiper-container", {
        loop: false,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          860: { // écrans supérieurs ou égaux à 860px
            slidesPerView: slidesPerViewConfig,
          },
          600: { //écrans supérieurs ou égaux à 600px
            slidesPerView: 3,
          },
          0: { // Pour les écrans inférieurs à 600px
            slidesPerView: 2,
          },
        },
        on: {
          reachEnd: function () {
            setTimeout(switchRegion, 1000);
          },
        },
      });

      swiperTitle = new Swiper(".region-title-wrapper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        direction: "horizontal",
        on: {
          slideChange: function () {},
        },
      });
    }

    function switchRegion() {
      currentRegionIndex = (currentRegionIndex + 1) % regions.length;
      loadRegion(currentRegionIndex);
    }

    loadRegion(currentRegionIndex);
  });
});
