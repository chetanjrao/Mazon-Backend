const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')


const PaymentModeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_bank: {
        type: Boolean,
        default: false
    }
})

const PaymentMode = resources.model('PaymentMode', PaymentModeSchema)
module.exports = PaymentMode