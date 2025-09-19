const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const User = require('./models/user'); // ✅ Use model from separate file


const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const forgotPasswordRoute = require('./routes/forgotPassword');
app.use('/', forgotPasswordRoute);
const resetPasswordRoute = require('./routes/resetPassword');
app.use('/', resetPasswordRoute);
const recordRoutes = require('./routes/recordRoutes');
app.use('/api/records', recordRoutes);

// MONGO DB CONNECTION
mongoose.connect('mongodb://localhost:27017/odisha_archive', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// MULTER CONFIG
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// NODEMAILER CONFIG
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanchitrout1312@gmail.com',
        pass: 'jxju ojio bdup izeo'
    }
});



// ✅ SEND OTP route (optional if already in /routes/sendOtp.js)
app.post('/send-otp', async(req, res) => {
    const { email, firstName } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    try {
        let user = await User.findOne({ email });

        if (!user) user = new User({ email });

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await transporter.sendMail({
            from: 'sanchitrout1312@gmail.com',
            to: email,
            subject: 'Your OTP for Odisha State Archives Registration',
            html: `<h3>Dear ${firstName},</h3><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`
        });

        res.status(200).json({ otp, otpExpires });
    } catch (err) {
        console.error('❌ OTP Error:', err);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// ✅ REGISTRATION ROUTE (after OTP)
app.post('/register', upload.single('profilePhoto'), async(req, res) => {
    try {
        const data = req.body;

        // check OTP first
        const existingUser = await User.findOne({ email: data.email });

        if (!existingUser) return res.status(404).json({ message: 'User not found' });
        if (existingUser.otp !== data.otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (existingUser.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });

        // Save full data
        const hashedPassword = await bcrypt.hash(data.password, 10);

        Object.assign(existingUser, {
            ...data,
            password: hashedPassword,
            profilePhotoPath: req.file ? req.file.path : null,
            otp: null,
            otpExpires: null,
            isVerified: true
        });

        await existingUser.save();

        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error('❌ Registration Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ LOGIN ROUTE
app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                phone: user.phone,
                dob: user.dob,
                profession: user.profession,
                address: user.address,
                profilePhotoPath: user.profilePhotoPath
            }
        });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});