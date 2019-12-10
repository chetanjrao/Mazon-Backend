const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const EmailVerificationSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }

})

const EmailVerification = resources.model('EmailVerification', EmailVerificationSchema)

module.exports = EmailVerification