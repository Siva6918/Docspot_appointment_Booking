const express = require('express');
const {
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
} = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// POST APPLY PUBLIC DOCTOR
router.post('/apply-public', upload.single('docImg'), publicApplyDoctorController);

// POST ADD DOCTOR (Admin)
router.post('/addDoctors', authMiddleware, roleMiddleware(['admin']), upload.single('docImg'), addDoctorController);

// POST APPLY DOCTOR
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// GET ALL DOCTORS (Public/User)
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// GET ALL DOCTORS (Admin)
router.get('/admin/getAllDoctors', authMiddleware, roleMiddleware(['admin']), getAllDoctorsForAdminController);

// POST UPDATE STATUS (Admin)
router.post('/admin/changeAccountStatus', authMiddleware, roleMiddleware(['admin']), changeAccountStatusController);

// POST GET SINGLE DOCTOR INFO
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

// POST UPDATE PROFILE
router.post('/updateProfile', authMiddleware, updateProfileController);

// POST GET SINGLE DOCTOR BY ID
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

// GET DOCTOR APPOINTMENTS
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);

// POST UPDATE STATUS
router.post('/update-status', authMiddleware, updateStatusController);

module.exports = router;
