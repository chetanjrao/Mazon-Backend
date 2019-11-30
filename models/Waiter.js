const mongoose = require("mongoose")
const {
    resources
} = require("../helpers/dbHelper")

const WaiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    waiter_no: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    is_confirmed: {
        type: Boolean,
        default: false
    },
    is_deactivated: {
        type: Boolean,
        default: false
    },
    gender: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Waiter = resources.model("Waiter", WaiterSchema)
module.exports = Waiter