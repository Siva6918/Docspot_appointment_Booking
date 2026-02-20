const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exists', success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new userModel(req.body);
        await newUser.save();

        res.status(201).send({ message: 'Register Successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Register Controller ${error.message}`, success: false });
    }
};

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login Success', success: true, token, user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}`, success: false });
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        } else {
            res.status(200).send({ success: true, data: user });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'auth error', success: false, error });
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure this env var is set or handle it

const googleLoginController = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub } = ticket.getPayload();

        let user = await userModel.findOne({ email });

        if (user) {
            // User exists, login
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).send({ message: 'Google Login Success', success: true, token, user });
        } else {
            // User doesn't exist, create new
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                isDoctor: false, // Default to user
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).send({ message: 'Google Signup Success', success: true, token, user: newUser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Google Auth Failed', success: false, error: error.message });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({ isDoctor: false, role: { $ne: 'admin' } });
        res.status(200).send({
            success: true,
            message: 'Users Fetched Successfully',
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Fetching Users',
            error,
        });
    }
};

const deleteUserController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.userId);
        res.status(200).send({
            success: true,
            message: 'User Deleted Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Deleting User',
            error,
        });
    }
};

module.exports = {
    loginController,
    registerController,
    authController,
    googleLoginController,
    getAllUsersController,
    deleteUserController
};
