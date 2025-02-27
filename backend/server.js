// server.js

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();
const app = express();
const port = 5002;

// Importer le gestionnaire de créneaux
const slotManager = require("./utils/slotManager");

// Configuration de CORS
app.use(cors());

// Connexion à MongoDB
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}`;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connexion à MongoDB Solution Net Plus réussie");

    // Générer les créneaux initiaux après la connexion à la base de données
    slotManager.manageSlotsCreation();

    // Configurer une tâche cron pour mettre à jour les créneaux quotidiennement
    cron.schedule("0 0 * * *", () => {
      console.log("Exécution de la mise à jour quotidienne des créneaux");
      slotManager.manageSlotsCreation();
    });
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// Configuration des dossiers statiques pour les ressources
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/fonts", express.static(path.join(__dirname, "../fonts")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/components", express.static(path.join(__dirname, "../components")));
app.use("/locales", express.static(path.join(__dirname, "../locales")));
app.use("/data", express.static(path.join(__dirname, "../data")));

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration des vues
app.set("views", path.join(__dirname, "../"));

// Middleware pour utiliser les routes
app.use("/", require("./routes/main"));

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "../pages/404.html"));
});

// Middleware pour gérer les erreurs 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "../pages/404.html"));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur est démarré sur le port ${port}`);
});
