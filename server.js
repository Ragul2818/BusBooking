const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('Bus Booking API is running...');
});

const PORT = process.env.PORT || 5000;
app.use('/api/buses', require('./routes/busRoutes'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
