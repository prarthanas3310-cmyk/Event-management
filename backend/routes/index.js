var express = require('express');
var router = express.Router();

const Registration = require('../models/Registration');
const Event = require('../models/Event');

/* ─── EVENT ROUTES ─── */

// CREATE Event
router.post('/events', async (req, res) => {
  try {
    const event = new Event({
      name: req.body.name,
      date: req.body.date,
      rooms: req.body.rooms // [{ roomNo, capacity }]
    });
    await event.save();
    res.json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET All Events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── REGISTRATION ROUTES ─── */

// CREATE Registration (with seat check)
router.post('/registrations', async (req, res) => {
  try {
    const { eventId, roomNo, ticketCount } = req.body;

    // Find event and check room availability
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const room = event.rooms.find(r => r.roomNo === roomNo);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const availableSeats = room.capacity - room.bookedSeats;
    if (ticketCount > availableSeats) {
      return res.status(400).json({
        error: `Only ${availableSeats} seat(s) available in ${roomNo}`
      });
    }

    // Deduct seats
    room.bookedSeats += Number(ticketCount);
    await event.save();

    // Save registration
    const registration = new Registration({
      userName: req.body.userName,
      ticketCount: Number(ticketCount),
      contact: req.body.contact,
      paymentStatus: req.body.paymentStatus,
      NameofEvent: req.body.NameofEvent,
      Date: req.body.Date,
      roomNo: roomNo,
      eventId: eventId
    });

    await registration.save();
    res.json({ message: "Registration Added Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET All Registrations
router.get('/registrations', async (req, res) => {
  let registrations = await Registration.find();
  res.json(registrations);
});

// SEARCH Registration
router.get('/registrations/search/:key', async (req, res) => {
  const key = req.params.key;
  const dateSearch = new Date(key);
  const isValidDate = !isNaN(dateSearch.getTime());

  let query = {
    $or: [
      { userName: { $regex: key, $options: "i" } },
      { contact: { $regex: key, $options: "i" } },
      { paymentStatus: { $regex: key, $options: "i" } },
      { NameofEvent: { $regex: key, $options: "i" } },
      { roomNo: { $regex: key, $options: "i" } }  // NEW
    ]
  };

  if (isValidDate) {
    const startOfDay = new Date(dateSearch);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateSearch);
    endOfDay.setHours(23, 59, 59, 999);
    query.$or.push({ Date: { $gte: startOfDay, $lte: endOfDay } });
  }

  let result = await Registration.find(query);
  res.json(result);
});

// GET Registration By ID
router.get('/registrations/:id', async (req, res) => {
  let registration = await Registration.findById(req.params.id);
  res.json(registration);
});

// UPDATE Registration (with seat adjustment)
router.put('/registrations/:id', async (req, res) => {
  try {
    const old = await Registration.findById(req.params.id);
    const { eventId, roomNo, ticketCount } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const room = event.rooms.find(r => r.roomNo === roomNo);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Refund old seats if same room, then check new count
    const isSameRoom = old.eventId?.toString() === eventId && old.roomNo === roomNo;
    const refund = isSameRoom ? old.ticketCount : 0;
    const available = room.capacity - room.bookedSeats + refund;

    if (Number(ticketCount) > available) {
      return res.status(400).json({
        error: `Only ${available} seat(s) available in ${roomNo}`
      });
    }

    // Adjust seats on old room if room changed
    if (!isSameRoom && old.eventId) {
      const oldEvent = await Event.findById(old.eventId);
      if (oldEvent) {
        const oldRoom = oldEvent.rooms.find(r => r.roomNo === old.roomNo);
        if (oldRoom) oldRoom.bookedSeats -= old.ticketCount;
        await oldEvent.save();
      }
    }

    room.bookedSeats = room.bookedSeats - refund + Number(ticketCount);
    await event.save();

    await Registration.findByIdAndUpdate(req.params.id, {
      userName: req.body.userName,
      ticketCount: Number(ticketCount),
      contact: req.body.contact,
      paymentStatus: req.body.paymentStatus,
      NameofEvent: req.body.NameofEvent,
      Date: req.body.Date,
      roomNo: roomNo,
      eventId: eventId
    });

    res.json({ message: "Registration Updated Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Registration (refund seats)
router.delete('/registrations/:id', async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (reg && reg.eventId) {
      const event = await Event.findById(reg.eventId);
      if (event) {
        const room = event.rooms.find(r => r.roomNo === reg.roomNo);
        if (room) room.bookedSeats -= reg.ticketCount;
        await event.save();
      }
    }
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;