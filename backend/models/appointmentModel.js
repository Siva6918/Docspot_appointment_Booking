const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    document: {
        type: String,
        // URL or path to uploaded file
    },
    appointmentTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
