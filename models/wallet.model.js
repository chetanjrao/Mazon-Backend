const mongoose = require('mongoose');
const {
    resources
} = require("../helpers/db.helper")
const Schema = mongoose.Schema
const WalletSchema = new Schema({
    card_no: {
        type: String,
        required: true,
        unique: true
    },
    card_pin: {
        type: String
    },
    u_id: {
        type: String,
        required: true
    },
    wallet_points: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Wallet = resources.model("Wallet", WalletSchema)

module.exports = Wallet