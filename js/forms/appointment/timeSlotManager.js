
/**
 * @file timeSlotManager.js
 * @description Gère l'affichage et la sélection des créneaux horaires.
 */

/**
 * Initialise les créneaux horaires et gère leur affichage et sélection.
 * 
 * @function initializeTimeSlots
 * @param {FormData} formData - Les données du formulaire contenant la date du rendez-vous.
 * @returns {Object} - Un objet contenant les fonctions `renderTimeSlots` et `selectTimeSlot`.
 * 
 * @property {Function} renderTimeSlots - Affiche les créneaux horaires disponibles.
 * @param {Array} renderTimeSlots.timeSlots - Une liste de créneaux horaires à afficher.
 * 
 * @property {Function} selectTimeSlot - Sélectionne un créneau horaire.
 * @param {string} selectTimeSlot.slot - Le créneau horaire à sélectionner.
 */
export const initializeTimeSlots = (formData) => {
  let selectedTimeSlot = null;
  const timeSlotsContainer = document.querySelector(".time-slots-container");
  const errorMsg = document.querySelector(".error-msg");

  const renderTimeSlots = (timeSlots) => {
    if (!Array.isArray(timeSlots)) {
      console.error("Les créneaux horaires ne sont pas valides. Type:", typeof timeSlots);
      timeSlotsContainer.innerHTML = "<p>Erreur dans les créneaux horaires.</p>";
      return;
    }

    timeSlotsContainer.innerHTML = "";
    errorMsg.innerHTML = "";
    
    if (timeSlots.length === 0) {
      errorMsg.innerHTML = "<p>Aucun créneau horaire disponible pour cette date.</p>";
      return;
    }

    const now = new Date();
    const [year, month, day] = formData.get('appointment-date').split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);

    timeSlots.forEach((slot) => {
      const slotElement = document.createElement("div");
      const slotTime = slot.time || slot;
      slotElement.textContent = slotTime;
      slotElement.className = "time-slot";

      const [slotHour, slotMinute] = slotTime.split(":").map(Number);
      const slotDateTime = new Date(selectedDate);
      slotDateTime.setHours(slotHour, slotMinute, 0, 0);

      if (slotDateTime < now) {
        slotElement.style.color = "#D1D1D1";
        slotElement.style.pointerEvents = "none";
      } else {
        slotElement.addEventListener("click", () => selectTimeSlot(slotTime));
      }

      if (selectedTimeSlot === slotTime) slotElement.classList.add("selected");

      timeSlotsContainer.appendChild(slotElement);
    });
  };

  const selectTimeSlot = (slot) => {
    selectedTimeSlot = slot;
    formData.set('appointment-time', slot);
    const timeSlots = document.querySelectorAll(".time-slot");
    timeSlots.forEach((slotElement) => {
      if (slotElement.textContent === slot) {
        slotElement.classList.add("selected");
      } else {
        slotElement.classList.remove("selected");
      }
    });
  };

  return { renderTimeSlots, selectTimeSlot };
};