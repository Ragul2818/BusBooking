const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Bus = require('../models/Bus');

const router = express.Router();

// Add a new bus (Admin only)
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, number, seats, route } = req.body;

        // Check if the bus already exists
        let bus = await Bus.findOne({ number });
        if (bus) return res.status(400).json({ message: "Bus already exists" });

        // Create new bus
        bus = new Bus({ name, number, seats, route });
        await bus.save();

        res.status(201).json({ message: "Bus added successfully", bus });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Update bus details (Admin only)
router.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        const { name, number, seats, route } = req.body;
        let bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Update bus details
        bus.name = name || bus.name;
        bus.number = number || bus.number;
        bus.seats = seats || bus.seats;
        bus.route = route || bus.route;

        await bus.save();
        res.json({ message: "Bus updated successfully", bus });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get all available buses
router.get('/search', async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Book a seat on a bus
router.post('/book/:busId', authMiddleware, async (req, res) => {
    try {
        const { seatNumber } = req.body;
        const bus = await Bus.findById(req.params.busId);

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Check if seat is already booked
        const seatTaken = bus.bookings.some(booking => booking.seatNumber === seatNumber);
        if (seatTaken) return res.status(400).json({ message: "Seat already booked" });

        // Add booking
        bus.bookings.push({ userId: req.user.id, seatNumber });
        await bus.save();

        res.json({ message: "Seat booked successfully", bus });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Cancel a booking
router.delete('/cancel/:busId/:seatNumber', authMiddleware, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Find and remove booking
        bus.bookings = bus.bookings.filter(booking =>
            !(booking.userId.toString() === req.user.id && booking.seatNumber === Number(req.params.seatNumber))
        );

        await bus.save();
        res.json({ message: "Booking cancelled successfully", bus });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});



module.exports = router;
