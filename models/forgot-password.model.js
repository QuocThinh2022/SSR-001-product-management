
const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 360,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema, 'forgot-password')