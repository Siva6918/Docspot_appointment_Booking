const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'doctor', 'admin'],
        default: 'user',
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },
    notifications: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
