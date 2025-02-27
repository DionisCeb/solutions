document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dynamicForm");

  // Fonction de validation d'un champ individuel
  const validateField = (field) => {
    const value = field.value.trim();
    const minLength = field.getAttribute("data-min-length");
    const isRequired = field.getAttribute("data-required") === "true";

    let errorMessage = "";

    if (isRequired && value === "") {
      errorMessage = "Ce champ est requis.";
    } else if (minLength && value.length < minLength) {
      errorMessage = `Ce champ doit avoir au moins ${minLength} caractères.`;
    } else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Le courriel n'est pas valide.";
      }
    } else if (field.type === "tel" && value) {
      const phoneRegex = /^(\(\d{3}\)\s?|\d{3}[\-\s]?)\d{3}[\-\s]?\d{4}$/;
      if (!phoneRegex.test(value)) {
        errorMessage = "Le numéro de téléphone n'est pas valide.";
      }
    }

    const errorElement = field.nextElementSibling;
    if (errorMessage) {
      if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
      } else {
        const newErrorElement = document.createElement("div");
        newErrorElement.classList.add("error-message");
        newErrorElement.textContent = errorMessage;
        field.insertAdjacentElement("afterend", newErrorElement);
      }
      field.style.marginBottom = "0";
      return false;
    } else {
      if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.style.display = "none";
      }
      field.style.marginBottom = "";
      return true;
    }
  };
  // Fonction de validation du formulaire entier
  window.validateForm = function () {
    const fields = form.querySelectorAll("[data-required], [data-min-length]");
    let allValid = true;

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        allValid = false;
      }
    });

    return allValid;
  };
});
