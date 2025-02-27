document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dynamicForm");
  // Ajoute un écouteur d'événement pour la soumission du formulaire
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Appelle la fonction de validation des formulaire
    if (validateForm()) {
      const nom = document.getElementById("nom").value;
      const courriel = document.getElementById("courriel").value;
      const commentaire = document.getElementById("commentaire").value;
      const telephone = document.getElementById("telephone").value;

      // Crée un objet avec les données du formulaire
      const message = {
        nom: nom,
        courriel: courriel,
        commentaire: commentaire,
        telephone: telephone,
      };

      // Sauvegarde le message dans localStorage
      let clientMessages =
        JSON.parse(localStorage.getItem("clientMessages")) || [];
      clientMessages.push(message);
      localStorage.setItem("clientMessages", JSON.stringify(clientMessages));

      // Envoie les données au serveur avec fetch
      fetch("/submit-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi des données.");
          }
          return response.json();
        })
        .then((data) => {
          // Mets à jour le texte du message de remerciement avec le nom de la personne
          document.getElementById("merciMessageText").textContent = `${nom}!`;
          // Affiche le message de remerciement et cache le formulaire
          document.getElementById("merciMessage").classList.remove("invisible");
          form.style.display = "none";
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi :", error);
          alert(
            "Une erreur s'est produite lors de la soumission. Veuillez réessayer."
          );
        });
    }
  });
});
