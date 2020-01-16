const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const WalletTokenSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        default: new Date()
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const WalletToken = resources.model('WalletToken', WalletTokenSchema)

module.exports = WalletToken