const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

/**
 * Ce fichier définit le modèle Mongoose pour la collection "appointment" dans une base de
 * données MongoDB. Ce modèle est utilisé pour représenter et manipuler des documents de
 * rendez-vous dans l'application. Voici une description détaillée des différentes parties
 * de ce fichier :
 *
 * 1. Importation des modules nécessaires :
 *    - `mongoose` : Bibliothèque pour travailler avec MongoDB dans un environnement Node.js.
 *    - `Schema` : Classe de Mongoose utilisée pour définir le schéma du modèle.
 *
 * 2. Définition du schéma pour la collection "appointment" :
 *    - Le schéma spécifie la structure des documents dans la collection.
 *    - `_id` : Identifiant unique du rendez-vous, généré automatiquement en tant que chaîne de caractères.
 *    - `service` : Liste des services demandés pour le rendez-vous, par défaut vide.
 *    - `nom` : Nom de la personne prenant le rendez-vous, obligatoire.
 *    - `courriel` : Adresse email de la personne prenant le rendez-vous, obligatoire.
 *    - `telephone` : Numéro de téléphone de la personne prenant le rendez-vous, obligatoire.
 *    - `adresse` : Adresse de la personne prenant le rendez-vous, obligatoire.
 *    - `ville` : Ville de la personne prenant le rendez-vous, obligatoire.
 *    - `code_postal` : Code postal de la personne prenant le rendez-vous, obligatoire.
 *    - `description_probleme` : Description du problème ou de la demande, obligatoire.
 *    - `date` : Date du rendez-vous, obligatoire.
 *    - `plage_horaire` : Plage horaire du rendez-vous, obligatoire.
 *    - `commentaires` : Commentaires ou informations supplémentaires, par défaut vide.
 *
 * 3. Création du modèle à partir du schéma :
 *    - Utilisation de la méthode `mongoose.model` pour créer le modèle "Appointment" basé sur le schéma défini.
 *
 * 4. Exportation du modèle pour utilisation dans d'autres parties de l'application.
 */

// Définition du schéma pour la collection "appointment"
const appointmentSchema = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    service: {
        type: [String],
        default: [],
    },
    nom: {
        type: String,
        required: true,
    },
    courriel: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    adresse: {
        type: String,
        required: true,
    },
    ville: {
        type: String,
        required: true,
    },
    code_postal: {
        type: String,
        required: true,
    },
    description_probleme: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        get: function(date) {
          return moment(date).tz('America/Toronto').toDate();
        },
        set: function(date) {
          return moment.tz(date, 'America/Toronto').utc().toDate();
        }
      },
    plage_horaire: {
        type: String,
        required: true,
    },
    commentaires: {
        type: String,
        default: '',
    }
});

// Création du modèle à partir du schéma
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
