const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const MobileOTPSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        maxlength: 6,
        minlength: 6,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const MobileOTP = resources.model('MobileOTP', MobileOTPSchema)
module.exports = MobileOTP