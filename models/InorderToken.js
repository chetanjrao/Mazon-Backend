const mongoose = require("mongoose")
const {
    resources
} = require("../helpers/dbHelper")

const InorderTokenSchema = new mongoose.Schema({
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
    table_no: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    is_disabled: {
        type: Boolean,
        default: false
    },
    offer_code: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const InorderToken = resources.model("InorderToken", InorderTokenSchema)

module.exports = InorderToken