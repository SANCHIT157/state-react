const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // adjust path if needed

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanchitrout1312@gmail.com',
        pass: 'jxju ojio bdup izeo'
    }
});

router.post('/send-otp', async(req, res) => {
    const { email, firstName } = req.body;

    if (!email || !firstName) {
        return res.status(400).json({ message: 'Email and name are required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await transporter.sendMail({
            from: 'sanchitrout1312@gmail.com',
            to: email,
            subject: 'Your OTP for Odisha State Archives',
            html: `<p>Hello ${firstName}, your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
        });

        res.status(200).json({ otp, otpExpires });
    } catch (error) {
        console.error('OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

module.exports = router;