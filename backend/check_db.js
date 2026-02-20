const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const doctorModel = require('./models/doctorModel');
const userModel = require('./models/userModel');
const appointmentModel = require('./models/appointmentModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const checkData = async () => {
    try {
        let output = `DATABASE REPORT - ${new Date().toISOString()}\n`;
        output += `=========================================\n\n`;

        // 1. USERS
        const users = await userModel.find({});
        output += `[ COLLECTION: USERS ]\n`;
        output += `Total Count: ${users.length}\n`;
        users.forEach((u, i) => {
            output += `\n  ${i + 1}. ID: ${u._id}\n     Name: ${u.name}\n     Email: ${u.email}\n     Role: ${u.role}\n     IsDoctor: ${u.isDoctor}\n`;
        });
        output += `\n-----------------------------------------\n\n`;

        // 2. DOCTORS
        const doctors = await doctorModel.find({});
        output += `[ COLLECTION: DOCTORS ]\n`;
        output += `Total Count: ${doctors.length}\n`;
        doctors.forEach((d, i) => {
            output += `\n  ${i + 1}. ID: ${d._id}\n     Name: ${d.fullname}\n     User ID: ${d.userId}\n     Status: ${d.status}\n     Specialization: ${d.specialization}\n`;
        });
        output += `\n-----------------------------------------\n\n`;

        // 3. APPOINTMENTS
        const appointments = await appointmentModel.find({});
        output += `[ COLLECTION: APPOINTMENTS ]\n`;
        output += `Total Count: ${appointments.length}\n`;
        appointments.forEach((a, i) => {
            output += `\n  ${i + 1}. ID: ${a._id}\n     User ID: ${a.userId}\n     Doctor ID: ${a.doctorId}\n     Date: ${a.date}\n     Status: ${a.status}\n`;
        });
        output += `\n=========================================\n`;

        fs.writeFileSync('db_output.txt', output);
        console.log('Data written to db_output.txt');
        console.log(output); // Also print to console for immediate view
        process.exit();
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
};

checkData();
