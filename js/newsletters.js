document
  .getElementById("newsletterForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const messageDiv = document.getElementById("message");
    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        // Réinitialise le formulaire et affiche un message de succès
        form.reset();
        messageDiv.textContent = result.message;
        messageDiv.style.color = "green";

        await sendNewsletters(email);
      } else {
        messageDiv.textContent = result.message;
        messageDiv.style.color = "red";
      }
    } catch (error) {
      // Gère les erreurs de la requête
      console.error("Erreur:", error);
      messageDiv.textContent = "Une erreur est survenue lors de l'inscription.";
      messageDiv.style.color = "red";
    }
  });
// Fonction pour envoyer des newsletters
async function sendNewsletters(email) {
  try {
    // Envoie une requête POST pour envoyer la newsletter
    const response = await fetch("/send-newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
