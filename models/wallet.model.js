const mongoose = require('mongoose');
const {
    resources
} = require("../helpers/db.helper")
const Schema = mongoose.Schema
const WalletSchema = new Schema({
    u_id: {
        type: String,
        required: true
    },
    wallet_points: {
        type: Number,
        required: true
    },
    history: {
        type: [String],
        default: []
    },
    last_transaction_time: {
        type: Date,
        default: new Date()
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Wallet = resources.model("Wallet", WalletSchema)

module.exports = Wallet