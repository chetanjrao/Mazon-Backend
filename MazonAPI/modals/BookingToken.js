const mongoose = require("mongoose")
const {
    resources
} = require("../helpers/dbHelper")

const BookingTokenSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const BookingToken = resources.model("BookingToken", BookingTokenSchema)

module.exports = BookingToken