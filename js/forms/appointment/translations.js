/**
 * @file translations.js
 * @description Gère les traductions pour l'internationalisation de l'application.
 */

const translations = {
  en: {
    requiredField: 'The field "{label}" is required.',
    minLength:
      'The field "{label}" must be at least {minLength} characters long.',
    invalidEmail: "The email address is not valid.",
    requiredAppointment: "Appointment date and time are required.",
    requiredService: "At least one service must be selected.",
    invalidPhone: "The phone number is not valid.",
    invalidPostalCode: "The postal code is not valid.",
  },
  fr: {
    requiredField: 'Le champ "{label}" est requis.',
    minLength:
      'Le champ "{label}" doit contenir au moins {minLength} caractères.',
    invalidEmail: "L'adresse e-mail n'est pas valide.",
    requiredAppointment: "La date et l'heure de rendez-vous sont requises.",
    requiredService: "Au moins un service doit être sélectionné.",
    invalidPhone: "Le numéro de téléphone n'est pas valide.",
    invalidPostalCode: "Le code postal n'est pas valide.",
  },
};

/**
 * Obtient la traduction pour une clé donnée.
 * @param {string} key - La clé de traduction.
 * @param {Object} params - Les paramètres pour la traduction.
 * @returns {string} La traduction.
 */
export const getTranslation = (key, params = {}) => {
  const language = localStorage.getItem("language") || "fr";
  let message = translations[language][key];
  Object.keys(params).forEach((param) => {
    message = message.replace(`{${param}}`, params[param]);
  });
  return message;
};
