const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const NewsletterSubscription = require("../models/newsletterSubscription");
const Appointment = require("../models/appointment");
const AvailableSlot = require("../models/availableSlot");
const moment = require("moment-timezone");
const {
  validateNewsletterSubscription,
  validateAppointment,
  validateComment,
} = require("../utils/validation/validateForms");
require("dotenv").config();
const router = express.Router();

// Middleware bodyParser pour traiter les données des formulaires POST
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//les routes
const routeMap = {
  "/": "index.html",
  "/accueil": "index.html",
  "/404": "404.html",
  "/contact": "Contact/Contact.html",
  "/services": "Services/Services.html",
  "/blog": "Blog/Blog.html",
  "/appointment": "Appointment/appointment.html",
};

// Fonction d'envoi du fichier
const sendFile = (filePath) => (req, res) => {
  res.sendFile(path.join(__dirname, "../../pages", filePath));
};

// Créer des itinéraires de manière dynamique
Object.entries(routeMap).forEach(([route, filePath]) => {
  router.get(route, sendFile(filePath));
});

// Configuration du service d'envoi d'email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Nouvelle route pour générer des créneaux horaires disponibles
router.post("/generate-slots", async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const times = ["09:00", "10:00", "13:00", "14:00", "16:00"];

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      for (let time of times) {
        await AvailableSlot.create({
          date: new Date(d),
          time: time,
          isBooked: false,
        });
      }
    }

    console.log("Créneaux horaires générés avec succès");
    res.status(200).json({ message: "Créneaux horaires générés avec succès" });
  } catch (error) {
    console.error("Erreur lors de la génération des créneaux horaires:", error);
    res.status(500).json({
      message: "Erreur lors de la génération des créneaux horaires",
      error: error.message,
    });
  }
});

// Nouvelle route pour obtenir les créneaux horaires disponibles
router.get("/available-slots/:date", async (req, res) => {
  try {
    const date = moment.tz(req.params.date, "America/Toronto").startOf("day");
    console.log("Date reçue:", date.format());

    if (!date.isValid()) {
      return res.status(400).json({ message: "Date invalide" });
    }

    const startOfDay = date.toDate();
    const endOfDay = date.clone().endOf("day").toDate();

    console.log("Recherche des créneaux entre:", startOfDay, "et", endOfDay);

    const slots = await AvailableSlot.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      isBooked: false,
    }).select("time -_id");

    console.log("Créneaux trouvés:", slots);
    res.json(slots);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des créneaux horaires:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des créneaux horaires",
    });
  }
});

// Mettre à jour la route existante pour la création de rendez-vous
router.post("/appointments", async (req, res) => {
  console.log("Requête reçue:", req.body);

  const validationResult = validateAppointment(req.body);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }
  try {
    const {
      service,
      nom,
      courriel,
      telephone,
      date,
      plage_horaire,
      ...otherData
    } = req.body;

    // Combiner la date et l'heure en un objet moment
    const appointmentDateTime = moment.tz(
      `${date} ${plage_horaire}`,
      "YYYY-MM-DD HH:mm",
      "America/Toronto"
    );
    console.log("Date du rendez-vous (Québec):", appointmentDateTime.format());

    // Vérifier si la date et l'heure du rendez-vous sont dans le futur
    const now = moment.tz("America/Toronto");
    if (appointmentDateTime.isBefore(now)) {
      console.log("Tentative de prise de rendez-vous dans le passé.");
      return res.status(400).json({
        message: "Vous ne pouvez pas prendre un rendez-vous dans le passé.",
      });
    }

    // Recherche du créneau horaire disponible
    const slot = await AvailableSlot.findOne({
      date: {
        $gte: appointmentDateTime.clone().startOf("day").toDate(),
        $lt: appointmentDateTime.clone().endOf("day").toDate(),
      },
      time: plage_horaire,
      isBooked: false,
    });

    console.log("Créneau trouvé:", slot);

    if (!slot) {
      console.log(
        "Aucun créneau disponible trouvé pour la date et l'heure demandées"
      );
      return res
        .status(400)
        .json({ message: "Créneau horaire non disponible" });
    }

    // Créer le rendez-vous
    const appointment = new Appointment({
      service,
      nom,
      courriel,
      telephone,
      date: slot.date,
      plage_horaire: slot.time,
      ...otherData,
    });
    await appointment.save();

    // Marquer le créneau comme réservé
    slot.isBooked = true;
    await slot.save();

    console.log("Rendez-vous créé avec succès:", appointment);

    res
      .status(200)
      .json({ message: "Rendez-vous créé avec succès", appointment });

    // Envoi d'un email de confirmation au client
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: courriel,
      subject: "Confirmation de rendez-vous",
      text: `Bonjour ${nom},\n\nVotre rendez-vous pour ${service} a été confirmé pour le ${appointmentDateTime.format(
        "YYYY-MM-DD"
      )} à ${plage_horaire}.\n\nMerci d'avoir choisi nos services!`,
    };

    try {
      await transporter.sendMail(mailOptionsClient);
      console.log("Email de confirmation envoyé avec succès au client");
    } catch (emailError) {
      console.error(
        "Erreur lors de l'envoi de l'email de confirmation au client :",
        emailError
      );
    }

    // Envoi d'un email au propriétaire avec les détails du rendez-vous
    const mailOptionsBusiness = {
      from: process.env.EMAIL_USER,
      to: "solutionnetplus@gmail.com",
      subject: "Nouveau rendez-vous réservé",
      text: `Un nouveau rendez-vous a été réservé.\n\nDétails du rendez-vous:\nNom: ${nom}\nTéléphone: ${telephone}\nCourriel: ${courriel}\nService(s): ${service}\nDate: ${appointmentDateTime.format(
        "YYYY-MM-DD"
      )}\nHeure: ${plage_horaire}\nAdresse: ${otherData.adresse}\nVille: ${
        otherData.ville
      }\nCode Postal: ${otherData.code_postal}\nDescription du problème: ${
        otherData.description_probleme
      }\nCommentaires: ${otherData.commentaires || "N/A"}`,
    };

    try {
      await transporter.sendMail(mailOptionsBusiness);
      console.log("Email de notification envoyé au propriétaire avec succès");
    } catch (emailError) {
      console.error(
        "Erreur lors de l'envoi de l'email au propriétaire :",
        emailError
      );
    }
  } catch (error) {
    console.error("Erreur détaillée:", error);
    console.error("Erreur lors de la création du rendez-vous:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la création du rendez-vous",
      error: error.message,
    });
  }
});

// Route pour gérer l'inscription à la newsletter
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const validationResult = validateNewsletterSubscription(email);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    // Créer un nouvel abonnement à la newsletter
    const newSubscription = new NewsletterSubscription({ email });
    await newSubscription.save();

    res.status(201).json({ message: "Inscription réussie à la newsletter!" });
  } catch (error) {
    // Gérer les erreurs, notamment les emails déjà inscrits
    if (error.code === 11000) {
      res.status(400).json({ message: "Cet email est déjà inscrit." });
    } else {
      res
        .status(500)
        .json({ message: "Erreur lors de l'inscription à la newsletter." });
    }
  }
});

router.post("/send-newsletter", async (req, res) => {
  const { email } = req.body;

  const validationResult = validateNewsletterSubscription(email);
  if (!validationResult.isValid) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
    });
  }

  try {
    let existingSubscription = await NewsletterSubscription.findOne({ email });
    if (!existingSubscription) {
      // Si l'e-mail n'est pas inscrit, nous nous inscrivons et envoyons l'e-mail de bienvenue.
      existingSubscription = new NewsletterSubscription({ email });
      await existingSubscription.save();
    }

    const mailOptions = {
      from: "wintechnobackend@gmail.com",
      to: email,
      subject: "Bienvenue à notre infolettre",
      text: "Merci de vous être inscrit à notre infolettre. Vous recevrez bientôt nos dernières nouvelles et mises à jour.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'infolettre :", error);
        return res.status(500).json({
          success: false,
          message: "Une erreur s'est produite lors de l'envoi de l'infolettre.",
        });
      }
      res.json({
        success: true,
        message: "Email de bienvenue envoyé avec succès.",
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue :", error);
    res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de l'envoi de l'email de bienvenue.",
    });
  }
});

router.post("/submit-comment", async (req, res) => {
  const validationResult = validateComment(req.body);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  const { nom, telephone, courriel, commentaire } = req.body;

  try {
    // Envoi d'un e-mail de confirmation au client
    const mailOptionsClient = {
      from: "wintechnobackend@gmail.com",
      to: courriel,
      subject: "Confirmation de réception de votre commentaire",
      text: `Bonjour ${nom},\n\nNous avons bien reçu votre commentaire: "${commentaire}".\nNous vous répondrons dans les plus brefs délais.\n\nMerci!`,
    };

    transporter.sendMail(mailOptionsClient, (error, info) => {
      if (error) {
        console.error(
          "Erreur lors de l'envoi de l'email de confirmation au client :",
          error
        );
      }
    });

    // Envoyer un e-mail à l'entreprise avec les détails du commentaire
    const mailOptionsCompany = {
      from: "wintechnobackend@gmail.com",
      to: "solutionnetplus@gmail.com",
      subject: "Nouveau commentaire reçu",
      text: `Vous avez reçu un nouveau commentaire de ${nom}.\n\nDétails:\nNom: ${nom}\nTéléphone: ${telephone}\nCourriel: ${courriel}\nCommentaire: ${commentaire}`,
    };

    transporter.sendMail(mailOptionsCompany, (error, info) => {
      if (error) {
        console.error(
          "Erreur lors de l'envoi de l'email à l'entreprise :",
          error
        );
      }
    });

    // Renvoyer la réponse de succès au frontend
    res.status(201).json({ message: "Commentaire soumis avec succès!" });
  } catch (error) {
    console.error("Erreur lors de la soumission du commentaire :", error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la soumission du commentaire.",
    });
  }
});

module.exports = router;
