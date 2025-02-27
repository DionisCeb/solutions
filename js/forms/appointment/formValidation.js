/**
 * @file formValidation.js
 * @description Gère la validation des champs du formulaire.
 */

import { getTranslation } from './translations.js';

/**
 * Initialise la validation du formulaire.
 * @param {Array} steps - Les étapes du formulaire.
 * @param {FormData} formData - Les données du formulaire.
 * @returns {Object} Fonctions de validation.
 */
export const initializeValidation = (steps, formData) => {
  /**
   * Valide tous les champs d'une étape.
   * @param {number} currentStep - L'étape actuelle.
   * @returns {boolean} - True si tous les champs sont valides, false sinon.
   */
    const validateStep = (currentStep) => {
      let allValid = true;
  
      switch (currentStep) {
        case 0:
          const serviceSelected = [...steps[currentStep].querySelectorAll("input[type='checkbox']")]
            .some(checkbox => checkbox.checked);
          if (!serviceSelected) {
            displayCustomError(getTranslation("requiredService"), currentStep);
            allValid = false;
          } else {
            clearCustomError(currentStep);
          }
          break;
        case 4:
          if (!formData.get("appointment-date") || !formData.get("appointment-time")) {
            displayCustomError(getTranslation("requiredAppointment"), currentStep);
            allValid = false;
          } else {
            clearCustomError(currentStep);
          }
          break;
        default:
          const fields = [...steps[currentStep].querySelectorAll("[data-required], [data-min-length]")];
          allValid = fields.every(validateField);
      }
  
      return allValid;
    };

  /**
   * Valide un champ individuel.
   * @param {HTMLElement} field - Le champ à valider.
   * @returns {boolean} - True si le champ est valide, false sinon.
   */
  const validateField = (field) => {
    const value = field.value.trim();
    const isRequired = field.getAttribute("data-required") === "true";
    const minLength = field.getAttribute("data-min-length");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
    let errorMessage = "";
  
    const label = getLabelText(field);
  
    if (isRequired && !value) {
      errorMessage = getTranslation("requiredField", { label });
    } else if (minLength && value.length < minLength) {
      errorMessage = getTranslation("minLength", { label, minLength });
    } else if (field.type === "email" && value && !emailRegex.test(value)) {
      errorMessage = getTranslation("invalidEmail");
    } else if (field.id === "phone" && value && !phoneRegex.test(value)) {
      errorMessage = getTranslation("invalidPhone");
    } else if (field.id === "postal-code" && value && !postalCodeRegex.test(value)) {
      errorMessage = getTranslation("invalidPostalCode");
    }
  
    if (errorMessage) {
      displayFieldError(field, errorMessage);
      return false;
    } else {
      clearFieldError(field);
      return true;
    }
  };

  /**
   * Affiche une erreur pour un champ spécifique.
   * @param {HTMLElement} field - Le champ avec l'erreur.
   * @param {string} message - Le message d'erreur.
   */
  const displayFieldError = (field, message) => {
    let errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = message;
    } else {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = message;
      field.insertAdjacentElement("afterend", errorElement);
    }
    field.style.marginBottom = "0";
  };

  /**
   * Efface l'erreur d'un champ spécifique.
   * @param {HTMLElement} field - Le champ dont l'erreur doit être effacée.
   */
  const clearFieldError = (field) => {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.style.display = "none";
    }
    field.style.marginBottom = "";
  };

  /**
   * Affiche une erreur personnalisée pour l'étape actuelle.
   * @param {string} message - Le message d'erreur à afficher.
   * @param {number} currentStep - L'étape actuelle.
   */
  const displayCustomError = (message, currentStep) => {
    let errorElement = steps[currentStep].querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = message;
    } else {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = message;
      steps[currentStep].insertBefore(
        errorElement,
        steps[currentStep].querySelector(".bnt-form")
      );
    }
  };

  /**
   * Efface l'erreur personnalisée de l'étape actuelle.
   * @param {number} currentStep - L'étape actuelle.
   */
  const clearCustomError = (currentStep) => {
    const errorElement = steps[currentStep].querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  };

  /**
   * Obtient le texte du label associé au champ.
   * @param {HTMLElement} field - Le champ dont on veut obtenir le label.
   * @returns {string} Le texte du label associé au champ.
   */
  const getLabelText = (field) => {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent : "";
  };

  return {
    validateStep,
    validateField,
    displayCustomError,
    clearCustomError
  };
};
