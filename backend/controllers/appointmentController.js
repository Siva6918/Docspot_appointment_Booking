const appointmentModel = require('../models/appointmentModel');
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const moment = require('moment'); // You might need to install moment if used for date logic, but assuming simple dates for now or ISO strings.

const bookAppointmentController = async (req, res) => {
    try {
        req.body.userId = req.userId;
        req.body.status = 'pending';
        req.body.date = new Date(req.body.date);
        if (req.file) {
            req.body.document = req.file.path;
        }

        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        let doctorUser;
        const doctor = await doctorModel.findById(req.body.doctorId);
        if (doctor) {
            doctorUser = await userModel.findById(doctor.userId);
            if (doctorUser) {
                doctorUser.notifications.push({
                    type: 'new-appointment-request',
                    message: `A new appointment request from ${req.body.userInfo ? req.body.userInfo.name : 'User'}`,
                    onClickPath: '/user/appointments'
                });
                await doctorUser.save();
            }
        }



        res.status(200).send({
            success: true,
            message: 'Appointment Book Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Booking Appointment',
        });
    }
};

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.userId });
        res.status(200).send({
            success: true,
            message: 'Users Appointments Fetch Successfully',
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error In User Appointments',
        });
    }
};

module.exports = { bookAppointmentController, userAppointmentsController };
