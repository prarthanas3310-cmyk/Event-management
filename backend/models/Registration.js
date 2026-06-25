const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  userName: String,
  ticketCount: Number,
  contact: String,
  NameofEvent: String,
  Date: Date,
  paymentStatus: String,
  roomNo: String,        // NEW
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" } // NEW
});

module.exports = mongoose.model("Registration", registrationSchema);