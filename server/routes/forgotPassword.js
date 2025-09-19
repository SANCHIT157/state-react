const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Make sure the path is correct
const crypto = require('crypto');

// Create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanchitrout1312@gmail.com',
        pass: 'jxju ojio bdup izeo' // Use App Password
    }
});

router.post('/forgot-password', async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.tokenExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${token}`;

        await transporter.sendMail({
            from: 'sanchitrout1312@gmail.com',
            to: email,
            subject: 'Reset your password',
            html: `
        <h3>Reset Password</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
        });

        res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;