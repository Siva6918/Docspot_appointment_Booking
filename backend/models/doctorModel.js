const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    timings: {
        type: Array,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    documents: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);
