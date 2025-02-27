/**
 * @file api.js
 * @description Gère les appels API pour la récupération des créneaux et la création de rendez-vous.
 */

/**
 * Récupère les créneaux horaires disponibles pour une date donnée.
 * @param {Date} date - La date pour laquelle récupérer les créneaux.
 * @returns {Promise<Array>} Les créneaux horaires disponibles.
 */
export const fetchAvailableSlots = async (date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    //console.log(`Récupération des créneaux pour la date: ${formattedDate}`);

    const response = await fetch(`/available-slots/${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const slots = await response.json();
    //console.log("Créneaux récupérés:", slots);
    return slots;
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    throw error;
  }
};

/**
 * Crée un nouveau rendez-vous.
 * @param {FormData} formData - Les données du formulaire.
 * @returns {Promise<Object>} La réponse du serveur.
 */
export const createAppointment = async (formData) => {
  try {
    const serviceMap = {
      'service1': "Nettoyage de Conduit de Ventilation",
      'service2': "Nettoyage d'Air Climatisé Mural",
      'service3': "Nettoyage de Conduit de Sécheuse",
      'service4': "Nettoyage d'Échangeur d'Air"
    };

    const services = Object.keys(serviceMap)
      .filter(service => formData.get(service) === 'on')
      .map(service => serviceMap[service]);

    const appointmentDate = new Date(formData.get('appointment-date'));
    // Ajuste para enviar apenas a data, sem a parte do tempo
    const dateString = appointmentDate.toISOString().split('T')[0];
    
    const appointmentData = {
      service: services,
      nom: formData.get('name'),
      courriel: formData.get('email'),
      telephone: formData.get('phone'),
      adresse: formData.get('address'),
      ville: formData.get('city'),
      code_postal: formData.get('postal-code'),
      description_probleme: formData.get('problem-description'),
      date: dateString,
      plage_horaire: formData.get('appointment-time'),
      commentaires: formData.get('comments')
    };

    //console.log('Donnes ->:', appointmentData);

    const response = await fetch('/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erreur lors de la création du rendez-vous');
    }

    return responseData;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};
