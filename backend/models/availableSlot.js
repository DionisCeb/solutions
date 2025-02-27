const mongoose = require('mongoose');
const moment = require('moment-timezone');

const availableSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    get: function(date) {
      return moment(date).tz('America/Toronto').startOf('day').toDate();
    },
    set: function(date) {
      return moment.tz(date, 'America/Toronto').startOf('day').utc().toDate();
    }
  },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

availableSlotSchema.index({ date: 1, time: 1 }, { unique: true });

const AvailableSlot = mongoose.model('AvailableSlot', availableSlotSchema);

module.exports = AvailableSlot;