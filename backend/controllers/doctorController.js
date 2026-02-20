const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ role: 'admin' });
        if (adminUser) {
            const notifications = adminUser.notifications;
            notifications.push({
                type: 'apply-doctor-request',
                message: `${newDoctor.fullname} Has Applied For A Doctor Account`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.fullname,
                    onClickPath: '/admin/doctors'
                }
            })
            await userModel.findByIdAndUpdate(adminUser._id, { notifications });
        }
        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Applying For Doctor',
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: 'Doctors Lists Fetched Successfully',
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Fetching Doctor',
        });
    }
};

// For Admin
const getAllDoctorsForAdminController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Doctors List Fetched Successfully',
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Fetching Doctor',
        });
    }
};

const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notifications = user.notifications;
        notifications.push({
            type: 'doctor-account-request-updated',
            message: `Your Doctor Account Request Has ${status}`,
            onClickPath: '/notification'
        });
        user.isDoctor = status === 'approved' ? true : false;
        await user.save();
        res.status(201).send({
            success: true,
            message: 'Account Status Updated',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Account Status',
            error
        });
    }
};


const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.userId });
        res.status(200).send({
            success: true,
            message: 'Doctor data fetch success',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching Doctor Details',
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.userId },
            req.body,
            { new: true } // Return updated document
        );
        res.status(200).send({
            success: true,
            message: 'Doctor Profile Updated',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Doctor Profile Update Issue',
            error,
        });
    }
};

const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: 'Single Doctor Info Fetched',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Single Doctor Info',
        });
    }
};

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.userId });
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor Profile Not Found',
            });
        }
        const appointments = await appointmentModel.find({ doctorId: doctor._id });
        res.status(200).send({
            success: true,
            message: 'Doctor Appointments Fetch Successfully',
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Doc Appointments',
        });
    }
};

const { sendEmail } = require('../services/emailService');

const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status, appointmentTime } = req.body;

        const updateData = { status };
        if (status === 'scheduled' && appointmentTime) {
            updateData.appointmentTime = new Date(appointmentTime);
        }

        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, updateData, { new: true })
            .populate('doctorId');

        const user = await userModel.findOne({ _id: appointments.userId });

        const timeInfo = appointments.appointmentTime
            ? ` on ${new Date(appointments.appointmentTime).toLocaleString()}`
            : '';

        user.notifications.push({
            type: 'status-updated',
            message: `Your appointment has been ${status}${timeInfo}`,
            onClickPath: '/doctor-appointments',
        });
        await user.save();

        // Send Email Notification
        const subject = `Appointment Status Update - DocSpot`;
        const doctorName = appointments.doctorId ? appointments.doctorId.fullname : 'Doctor';
        const text = `Hello ${user.name},\n\nYour appointment with Dr. ${doctorName} has been ${status}${timeInfo}.\n\nLog in to your dashboard for more details.\n\nBest regards,\nDocSpot Team`;

        await sendEmail({ to: user.email, subject, text });

        res.status(200).send({
            success: true,
            message: 'Appointment Status Updated',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error In Update Status',
        });
    }
};



const publicApplyDoctorController = async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience, fees, address, timings } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ message: 'Email Already Exists', success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'doctor',
            isDoctor: true
        });
        const savedUser = await newUser.save();

        const newDoctor = new doctorModel({
            userId: savedUser._id,
            fullname: name,
            email,
            phone,
            specialization,
            experience,
            fees,
            address,
            timings: JSON.parse(timings), // Expecting JSON string for array
            status: 'pending',
            documents: req.file ? req.file.path : ''
        });
        await newDoctor.save();

        res.status(201).send({
            success: true,
            message: 'Application Submitted Successfully. Log in after Admin Approval.',
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Public Apply',
            error
        });
    }
};

const addDoctorController = async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience, fees, address, timings } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exists', success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'doctor',
            isDoctor: true
        });
        const savedUser = await newUser.save();

        const newDoctor = new doctorModel({
            userId: savedUser._id,
            fullname: name,
            email,
            phone,
            specialization,
            experience,
            fees,
            address,
            timings: JSON.parse(timings), // or format accordingly
            status: 'approved', // Admin added, so approved
            documents: req.file ? req.file.path : ''
        });
        await newDoctor.save();

        res.status(201).send({
            success: true,
            message: 'Doctor Added Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Adding Doctor',
            error
        });
    }
};

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController,
    applyDoctorController,
    getAllDoctorsController,
    getAllDoctorsForAdminController,
    changeAccountStatusController,
    publicApplyDoctorController,
    addDoctorController
};
