const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // adjust path if needed

const router = express.Router();

router.post('/reset-password/:token', async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetToken: token,
            tokenExpires: { $gt: Date.now() } // Token not expired
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        // Hash and update password
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        user.resetToken = undefined;
        user.tokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error('❌ Reset Password Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;