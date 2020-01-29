const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const PasskeySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    passkey: {
        type: String,
        default: true
    },
    expiry: {
        type: Date,
        required: true
    },
    grant_method: {
        type: String,
        required: true
    },
    grant_value: {
        type: String
    },
    ip: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    is_valid: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Passkey = resources.model('Passkey', PasskeySchema)
module.exports = Passkey