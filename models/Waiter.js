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
    mobile: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    is_confirmed: {
        is_confirmed: {
            type: Boolean,
            default: false
        },
        confirmed_by: {
            type: String
        },
        confirmed_at: {
            type: Date
        }
    },
    is_deactivated: {
        is_deactivated: {
            type: Boolean,
            default: false
        },
        deactivated_by: {
            type: String
        },
        deactivated_at: {
            type: Date
        }
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