const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const PaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    payment_mode: {
        type: String,
        required: true
    },
    payment_amount: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    created_by: {
        type: String,
        required: true
    }
})

const Payment = resources.model('Payment', PaymentSchema)
module.exports = Payment