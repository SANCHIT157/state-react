const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

// 📦 Multer config for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// 📬 Registration route
router.post(
    '/',
    upload.single('profilePhoto'), [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('confirmPassword').notEmpty().withMessage('Please confirm your password'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('phone').isLength({ min: 10 }).withMessage('Phone must be at least 10 digits'),
        body('dob').notEmpty().withMessage('Date of birth is required'),
        body('profession').notEmpty().withMessage('Profession is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('terms').custom(value => value === 'true' || value === 'on').withMessage('You must accept the terms')
    ],
    async(req, res) => {
        console.log('✅ Request received at /register');
        console.log('📦 req.body:', req.body);
        console.log('🖼 req.file:', req.file);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Profile photo is required' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        try {
            const data = req.body;
            data.profilePhotoPath = req.file.path;

            // 🔒 Hash the password
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
            delete data.confirmPassword;

            // After hashing password
            delete data.confirmPassword;

            // 🧠 Add OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

            data.otp = otp;
            data.otpExpires = otpExpires;


            const newUser = new User(data);
            await newUser.save();

            // (Optional: send OTP via email here)

            res.status(201).json({ message: 'Registration successful. OTP sent to email.' });
        } catch (error) {
            console.error('❌ Error saving user:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;