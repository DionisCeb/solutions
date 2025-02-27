/**
 * @file calendarRenderer.js
 * @description Gère le rendu et les interactions du calendrier.
 */

import { fetchAvailableSlots } from './api.js';
import { initializeTimeSlots } from './timeSlotManager.js';

export const initializeCalendar = (formData) => {
  let currentDate = new Date();
  let selectedDate = new Date(); // **Sélectionner la date du jour par défaut**

  const calendarDays = document.querySelector(".calendar-days");
  const currentYearElement = document.querySelector(".current-year");
  const currentMonthElement = document.querySelector(".current-month");
  const prevMonthBtn = document.querySelector(".prev-month-btn");
  const nextMonthBtn = document.querySelector(".next-month-btn");

  const { renderTimeSlots } = initializeTimeSlots(formData);

  const renderCalendar = () => {
    const language = localStorage.getItem("language") || "fr";
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();

    currentYearElement.textContent = currentDate.getFullYear();
    currentMonthElement.textContent = currentDate.toLocaleString(language, { month: "long" });

    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarDays.appendChild(document.createElement("div"));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = document.createElement("div");
      const currentLoopDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

      dayElement.textContent = i;

      if (
        currentLoopDate < today.setHours(0, 0, 0, 0) ||
        currentLoopDate.getDay() === 0 ||
        currentLoopDate.getDay() === 6
      ) {
        dayElement.style.color = "#D1D1D1";
        dayElement.style.pointerEvents = "none";
      } else {
        dayElement.addEventListener("click", () => handleDayClick(dayElement, currentLoopDate));
      }

      if (
        selectedDate &&
        i === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear()
      ) {
        dayElement.classList.add("selected");
      }
      calendarDays.appendChild(dayElement);
    }
  };


  /**
 * Initialise le calendrier et configure les événements nécessaires pour la navigation et la sélection des dates.
 *
 * @param {FormData} formData - Les données du formulaire contenant les informations de rendez-vous.
 * @returns {Object} Un objet contenant les fonctions `renderCalendar` et `handleDayClick`.
 *
 * @function initializeCalendar
 * @description Cette fonction initialise le calendrier en affichant les jours du mois courant et en configurant les événements pour naviguer entre les mois et sélectionner des dates. Les jours passés, les dimanches et les samedis sont désactivés. Lorsqu'un jour est sélectionné, les créneaux horaires disponibles pour cette date sont récupérés et affichés.
 *
 */
  const handleDayClick = async (dayElement, date) => {
    const previouslySelected = calendarDays.querySelector('.selected');
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
    }

    dayElement.classList.add('selected');
    selectedDate = date;
    const localISOString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
    formData.set('appointment-date', localISOString);

    //console.log('Date sélectionnée:', selectedDate);
    try {
      const availableSlots = await fetchAvailableSlots(selectedDate);
      renderTimeSlots(availableSlots);
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux horaires:', error);
      document.querySelector(".time-slots-container").innerHTML = '<p>Erreur lors du chargement des créneaux horaires. Veuillez réessayer.</p>';
    }
  };

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // **Initialiser le calendrier et sélectionner le jour actuel**
  const initCalendar = async () => {
    renderCalendar();

    // Trouver l'élément du jour actuel et simuler un clic
    const today = new Date();
    const dayElements = calendarDays.querySelectorAll('div');
    for (let dayElement of dayElements) {
      const dayNumber = parseInt(dayElement.textContent);
      if (
        dayNumber === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      ) {
        if (dayElement.style.pointerEvents !== 'none') {
          await handleDayClick(dayElement, today);
        }
        break;
      }
    }
  };

  // Appeler la fonction d'initialisation
  initCalendar();

  return { renderCalendar, handleDayClick };
};