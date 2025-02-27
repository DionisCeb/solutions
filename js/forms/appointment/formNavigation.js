/**
 * @file formNavigation.js
 * @description Gère la navigation entre les étapes du formulaire.
 */

import { initializeValidation } from './formValidation.js';
import { createAppointment, fetchAvailableSlots } from './api.js';
import { initializeTimeSlots } from './timeSlotManager.js';

/**
 * Initialise la navigation du formulaire.
 * @param {Array} steps - Les étapes du formulaire.
 * @param {FormData} formData - Les données du formulaire.
 * @param {number} currentStep - L'étape actuelle.
 * @returns {Object} Fonctions de gestion de la navigation.
 */
export const initializeNavigation = (steps, formData, currentStep) => {
    const { validateStep, displayCustomError } = initializeValidation(steps, formData);
    const { renderTimeSlots } = initializeTimeSlots(formData);
  
    const handleNavigation = (e) => {
        if (e.target.matches("[data-next]")) {
          e.preventDefault();
          const nextStep = parseInt(e.target.dataset.next);
          if (validateStep(currentStep)) {
            saveData(steps[currentStep], formData);
            animateStepChange(currentStep + 1, nextStep, "next", steps);
            currentStep = nextStep - 1;
            showStep(currentStep, steps);
            populateData(steps[currentStep], formData);
            updateBackIcon(nextStep);
          }
        } else if (e.target.matches("[data-prev]")) {
          e.preventDefault();
          saveData(steps[currentStep], formData);
          const prevStep = parseInt(e.target.dataset.prev);
          animateStepChange(currentStep + 1, prevStep, "prev", steps);
          currentStep = prevStep - 1;
          showStep(currentStep, steps);
          populateData(steps[currentStep], formData);
          updateBackIcon(prevStep);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
          saveData(steps[currentStep], formData);
          try {
            const response = await createAppointment(formData);
            if (response.message === 'Créneau horaire non disponible') {
              displayCustomError("Le créneau horaire sélectionné n'est plus disponible. Veuillez choisir un autre horaire.", 4);
              showStep(4, steps);
              updateBackIcon(5);
              const availableSlots = await fetchAvailableSlots(new Date(formData.get("appointment-date")));
              renderTimeSlots(availableSlots);
            } else {
              showStep(6, steps);
              updateBackIcon(7);
            }
          } catch (error) {
            console.error('Erreur:', error);
            displayCustomError(error.message || "Erreur de connexion.", currentStep);
          }
        }
      };    
      return { handleNavigation, handleSubmit };
    };

/**
 * Affiche l'étape spécifiée du formulaire.
 * @param {number} step - L'étape à afficher.
 * @param {Array} steps - Toutes les étapes du formulaire.
 */
export const showStep = (step, steps) => {
    steps.forEach((s, i) => {
      s.classList.toggle("hidden", i !== step);
      s.setAttribute("data-step", i + 1);
    });
    document.querySelector(".description-bar").style.display = step === 0 ? "block" : "none";
    document.querySelector("#submit-form").disabled = step !== steps.length - 2;
  };

/**
 * Met à jour l'icône de retour.
 * @param {number} currentStep - L'étape actuelle.
 */
export const updateBackIcon = (currentStep) => {
    const backIcon = document.querySelector(".navbar-icon a");
    if (currentStep === 1) {
      backIcon.href = "/pages/";
      backIcon.onclick = null;
    } else {
      backIcon.href = "#";
      backIcon.onclick = (e) => {
        e.preventDefault();
        const prevStep = currentStep - 1;
        animateStepChange(currentStep, prevStep, "prev", document.querySelectorAll(".form-step"));
        showStep(prevStep - 1, document.querySelectorAll(".form-step"));
        updateBackIcon(prevStep);
      };
    }
  };

/**
 * Anime le changement d'étape.
 * @param {number} currentStep - L'étape actuelle.
 * @param {number} nextStep - L'étape suivante.
 * @param {string} direction - La direction de l'animation ('next' ou 'prev').
 * @param {Array} steps - Toutes les étapes du formulaire.
 */
const animateStepChange = (currentStep, nextStep, direction, steps) => {
    const currentSection = steps[currentStep - 1];
    const nextSection = steps[nextStep - 1];
  
    const startY = direction === "next" ? "100%" : "-100%";
    const endY = "0%";
  
    currentSection.style.transition = "transform 0.5s ease-out";
    currentSection.style.transform = `translateY(${direction === "next" ? "-100%" : "100%"})`;
  
    nextSection.style.transition = "none";
    nextSection.style.transform = `translateY(${startY})`;
    nextSection.classList.remove("hidden");
  
    nextSection.offsetHeight; // Force a reflow
  
    nextSection.style.transition = "transform 0.5s ease-out";
    nextSection.style.transform = `translateY(${endY})`;
  
    setTimeout(() => {
      currentSection.classList.add("hidden");
      currentSection.style.transform = "";
      nextSection.style.transition = "";
    }, 500);
  };

/**
 * Sauvegarde les données de l'étape actuelle.
 * @param {HTMLElement} step - L'étape actuelle.
 * @param {FormData} formData - Les données du formulaire.
 */
const saveData = (step, formData) => {
    const fields = step.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      formData.set(field.id, field.type === "checkbox" ? (field.checked ? "on" : "off") : field.value);
    });
  };

/**
 * Remplit les champs avec les données précédemment saisies.
 * @param {HTMLElement} step - L'étape à remplir.
 * @param {FormData} formData - Les données du formulaire.
 */
const populateData = (step, formData) => {
    const fields = step.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      if (formData.has(field.id)) {
        if (field.type === "checkbox") {
          field.checked = formData.get(field.id) === "on";
        } else {
          field.value = formData.get(field.id);
        }
      }
    });
  };