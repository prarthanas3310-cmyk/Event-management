const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNo: String,
  capacity: Number,
  bookedSeats: { type: Number, default: 0 }
});

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  rooms: [roomSchema]
});

module.exports = mongoose.model("Event", eventSchema);