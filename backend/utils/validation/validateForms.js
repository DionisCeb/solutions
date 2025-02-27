const validator = require("validator");
// Valide l'inscription à la newsletter en vérifiant la présence et la validité de l'email
const validateNewsletterSubscription = (email) => {
  if (!email || !validator.isEmail(email)) {
    return {
      isValid: false,
      message: "Email invalide ou manquant. :)",
    };
  }
  return { isValid: true };
};
// Valide les données d'un rendez-vous, incluant le service, nom, courriel, téléphone, date et plage horaire
const validateAppointment = (data) => {
  const { service, nom, courriel, telephone, date, plage_horaire } = data;
  if (
    !service ||
    (!Array.isArray(service) && typeof service !== "string") ||
    (Array.isArray(service) && service.length === 0) ||
    (typeof service === "string" && service.trim() === "")
  ) {
    return { isValid: false, message: "Le service est requis." };
  }

  if (!nom || typeof nom !== "string" || nom.trim() === "") {
    return { isValid: false, message: "Le nom est requis." };
  }

  if (!courriel || !validator.isEmail(courriel)) {
    return { isValid: false, message: "Courriel invalide." };
  }

  if (!telephone || !validator.isMobilePhone(telephone, "any")) {
    return { isValid: false, message: "Numéro de téléphone invalide." };
  }

  if (!date || !validator.isDate(date)) {
    return { isValid: false, message: "Date invalide." };
  }

  if (!plage_horaire || !/^\d{2}:\d{2}$/.test(plage_horaire)) {
    return { isValid: false, message: "Plage horaire invalide." };
  }

  return { isValid: true };
};

// Valide les données d'un commentaire, incluant nom, téléphone, courriel et le texte du commentaire
const validateComment = (data) => {
  const { nom, telephone, courriel, commentaire } = data;

  if (!nom || !validator.isLength(nom, { min: 5 })) {
    return {
      isValid: false,
      message: "Le nom est invalide ou manquant (minimum 5 caractères).",
    };
  }

  if (!telephone || !validator.isMobilePhone(telephone, "any")) {
    return {
      isValid: false,
      message: "Le numéro de téléphone est invalide ou manquant.",
    };
  }

  if (!courriel || !validator.isEmail(courriel)) {
    return { isValid: false, message: "Le courriel est invalide ou manquant." };
  }

  if (!commentaire || !validator.isLength(commentaire, { min: 25 })) {
    return {
      isValid: false,
      message: "Le commentaire est trop court (minimum 25 caractères).",
    };
  }

  return { isValid: true };
};

module.exports = {
  validateNewsletterSubscription,
  validateAppointment,
  validateComment,
};
