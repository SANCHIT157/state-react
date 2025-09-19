const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // adjust the path if needed

// POST /login
router.post('/', async(req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Return full profile details (safe fields only)
        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                userType: user.userType,
                profilePhotoPath: user.profilePhotoPath || null,
                profession: user.profession || 'N/A',
                dob: user.dob || 'N/A',
                phone: user.phone || 'N/A',
                address: user.address || 'N/A'
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;