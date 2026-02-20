const express = require('express');
const { loginController, registerController, authController } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register || POST
router.post('/register', registerController);

// Login || POST
router.post('/login', loginController);

// Auth || POST 
router.post('/getUserData', authMiddleware, authController);


// Google Auth || POST
router.post('/google-login', require('../controllers/userController').googleLoginController);

// Get All Users || GET
router.get('/getAllUsers', authMiddleware, require('../controllers/userController').getAllUsersController);

// Delete User || POST
router.post('/deleteUser', authMiddleware, require('../controllers/userController').deleteUserController);

module.exports = router;
