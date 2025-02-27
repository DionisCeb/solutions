// utils/slotManager.js

const path = require("path");
const AvailableSlot = require(path.join(
  __dirname,
  "..",
  "models",
  "availableSlot"
));

class SlotManager {
  constructor() {
    this.times = ["09:00", "10:00", "13:00", "14:00", "16:00"]; // Créneaux horaires disponibles
    this.daysToGenerate = 90; // Nombre de jours à maintenir dans le futur
  }

  async manageSlotsCreation() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastExistingSlot = await AvailableSlot.findOne().sort({ date: -1 });
      const startDate = lastExistingSlot
        ? new Date(lastExistingSlot.date)
        : today;
      startDate.setDate(startDate.getDate() + 1); // Commencer le jour suivant le dernier créneau existant

      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + this.daysToGenerate);

      if (startDate <= endDate) {
        await this.generateSlots(startDate, endDate);
        console.log("Créneaux horaires mis à jour avec succès");
      } else {
        console.log("Les créneaux horaires sont à jour");
      }

      await this.removeExpiredSlots(today);
    } catch (error) {
      console.error("Erreur lors de la gestion des créneaux horaires:", error);
    }
  }

  async generateSlots(startDate, endDate) {
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      for (let time of this.times) {
        await AvailableSlot.findOneAndUpdate(
          { date: new Date(d), time: time },
          { date: new Date(d), time: time },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }
  }

  async removeExpiredSlots(today) {
    const now = new Date();

    // Convertir la date 'today' en début de journée
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    // Convertir l'heure actuelle en format 'HH:MM'
    const currentTime = now.toTimeString().slice(0, 5);

    const result = await AvailableSlot.deleteMany({
      $or: [
        { date: { $lt: startOfToday } },
        {
          date: startOfToday,
          time: { $lt: currentTime },
        },
      ],
    });

    console.log(`${result.deletedCount} créneaux expirés supprimés`);
  }
}

module.exports = new SlotManager();
