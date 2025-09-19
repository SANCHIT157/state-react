const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profilePhotoPath: String,
    userType: String,
    firstName: String,
    middleName: String,
    lastName: String,
    dob: Date,
    email: { type: String, required: true, unique: false },
    phone: String,
    profession: String,
    address: String,
    fatherName: String,
    password: String,
    govIdType: String,
    govIdNumber: String,
    aadhaar: String,
    passport: String,
    university: String,
    institution: String,
    country: String,
    otp: String,
    otpExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    tokenExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);