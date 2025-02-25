const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    seats: { type: Number, required: true },
    route: { type: String, required: true },
    bookings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            seatNumber: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Bus', BusSchema);
