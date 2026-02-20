const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/appointment', require('./routes/appointmentRoutes'));

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        return res.status(400).send({ success: false, message: `Upload Error: ${err.message}` });
    }
    res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
