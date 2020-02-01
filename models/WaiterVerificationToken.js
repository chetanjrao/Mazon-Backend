const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const WaiterVerificationSchema = new mongoose.Schema({
    waiter: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    is_used: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: new Date()
    },
})

const WaiterVerificationToken = resources.model('WaiterVerificationToken', WaiterVerificationSchema)

module.exports = WaiterVerificationToken