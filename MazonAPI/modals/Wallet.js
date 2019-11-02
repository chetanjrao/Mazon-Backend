const mongoose = require('mongoose');
const {
    resources
} = require("../helpers/dbHelper")
const Schema = mongoose.Schema
const WalletSchema = new Schema({
    u_id: {
        type: String,
        required: true
    },
    w_id: {
        type: String,
        required: true
    },
    wallet_points: {
        type: Number,
        required: true
    },
    history: [String],
    last_transaction_time: {
        type: Date,
        default: new Date()
    }
})

const Wallet = resources.model("Wallet", WalletSchema)

module.exports = Wallet