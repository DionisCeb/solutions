// utils/slotGenerator.js

const path = require("path");
const AvailableSlot = require(path.join(
  __dirname,
  "..",
  "models",
  "availableSlot"
));

async function generateInitialSlots() {
  try {
    // Vérifier si des créneaux existent déjà
    const existingSlots = await AvailableSlot.countDocuments();
    if (existingSlots > 0) {
      console.log(
        "Des créneaux horaires existent déjà. Pas besoin de générer."
      );
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const times = ["09:00", "10:00", "13:00", "14:00", "16:00"];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      for (let time of times) {
        await AvailableSlot.create({
          date: new Date(d),
          time: time,
        });
      }
    }

    console.log("Créneaux horaires générés avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération des créneaux horaires:", error);
  }
}

module.exports = generateInitialSlots;
