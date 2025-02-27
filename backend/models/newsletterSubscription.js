/**
 * Ce fichier définit le modèle Mongoose pour la collection "newsletterSubscription" dans une base de
 * données MongoDB. Ce modèle est utilisé pour représenter et manipuler des abonnements à la newsletter
 * dans l'application. Voici une description détaillée des différentes parties de ce fichier :
 *
 * 1. Importation des modules nécessaires :
 *    - `mongoose` : Bibliothèque pour travailler avec MongoDB dans un environnement Node.js.
 *
 * 2. Définition du schéma pour la collection "newsletterSubscription" :
 *    - Le schéma spécifie la structure des documents dans la collection.
 *    - `_id` : Identifiant unique de l'abonnement, généré automatiquement en tant que chaîne de caractères.
 *    - `email` : Adresse email de l'abonné, obligatoire, unique, en minuscules, et avec les espaces enlevés aux extrémités.
 *    - `subscribedAt` : Date d'abonnement, par défaut la date actuelle.
 *
 * 3. Création du modèle à partir du schéma :
 *    - Utilisation de la méthode `mongoose.model` pour créer le modèle "NewsletterSubscription" basé sur le schéma défini.
 *
 * 4. Exportation du modèle pour utilisation dans d'autres parties de l'application.
 */

const mongoose = require("mongoose");

// Définition du schéma pour la collection "newsletterSubscription"
const newsletterSubscriptionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Génère un ID unique sous forme de chaîne
  },
  email: {
    type: String,
    required: true,
    unique: true, // email unique dans la base de données
    lowercase: true, // Convertit l'email en minuscules
    trim: true, // Enlever les espaces en début et fin de chaîne
  },
  subscribedAt: {
    type: Date,
    default: Date.now, // date actuelle par défaut
  },
});

// Création du modèle "NewsletterSubscription" à partir du schéma
const NewsletterSubscription = mongoose.model(
  "NewsletterSubscription",
  newsletterSubscriptionSchema
);

// Exportation du modèle 
module.exports = NewsletterSubscription;
