const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Wallet = new Schema({
    uID: {
        type: String,
        required: true
    },
    wID: {
        type: String,
        required: true
    },
    walletAccessToken: {
        type: String,
        required: true
    },
    walletPoints: {
        type: Number,
        required: true
    },
    history: [String],
    lastTransactionTime: {
        type: String
    }
})

module.exports = Wallet