const express = require('express');
const { bookAppointmentController, userAppointmentsController } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// POST BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, upload.single('document'), bookAppointmentController);

// GET USER APPOINTMENTS
router.get('/user-appointments', authMiddleware, userAppointmentsController);

module.exports = router;
