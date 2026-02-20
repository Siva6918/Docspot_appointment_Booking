const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('./models/userModel');
const connectDB = require('./config/db');

const seedAdmin = async () => {
    try {
        await connectDB();

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            process.exit(1);
        }

        const existing = await userModel.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const admin = new userModel({
            name: ADMIN_NAME || 'Admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            phone: ADMIN_PHONE || '0000000000',
            role: 'admin',
            isDoctor: false,
        });

        await admin.save();
        console.log('Admin user created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
