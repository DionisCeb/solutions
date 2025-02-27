/**
 * @file appointment.js
 * @description Fichier principal pour la gestion du formulaire de rendez-vous.
 * Il orchestre les différents modules et initialise l'application.
 */

import { initializeNavigation, showStep, updateBackIcon } from './formNavigation.js';
import { initializeValidation } from './formValidation.js';
import { initializeCalendar } from './calendarRenderer.js';
import { initializeTimeSlots } from './timeSlotManager.js';

document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM et variables d'état
  const form = document.getElementById("multiStepForm");
  const steps = [...document.querySelectorAll(".form-step")];
  const backLink = document.getElementById("backLink");
  let currentStep = 0;
  const formData = new FormData(form);

  /**
   * Initialise l'application de prise de rendez-vous.
   */
  const initAppointment = () => {
    const { handleNavigation, handleSubmit } = initializeNavigation(steps, formData, currentStep);
    const { validateStep, clearCustomError } = initializeValidation(steps, formData);
    const { renderCalendar, handleDayClick } = initializeCalendar(formData);
    const { renderTimeSlots, selectTimeSlot } = initializeTimeSlots(formData);

    form.addEventListener("click", handleNavigation);
    form.addEventListener("submit", handleSubmit);
    backLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        history.back();
      } else {
        window.location.href = backLink.getAttribute("href");
      }
    });

    // Initialisation du calendrier et des créneaux horaires
    renderCalendar();
    renderTimeSlots([]);

    // Gestion des cases à cocher dans la première étape
    const checkboxes = steps[0].querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => clearCustomError(0, steps));
    });

    showStep(currentStep, steps);
    updateBackIcon(1);

    document.querySelector(".description-bar").classList.remove("hidden");
  };

  initAppointment();
});