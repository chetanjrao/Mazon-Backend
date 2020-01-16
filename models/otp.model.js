const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const OTPSchema = new mongoose.Schema({
    otp: {
        type: String,
        maxlength: 6,
        minlength: 6,
        required: true
    },
    grant_value: {
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

const OTP = resources.model('otp', OTPSchema)
module.exports = OTP