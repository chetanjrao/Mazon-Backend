const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const OfferSchema = new mongoose.Schema({
    rId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    offer_type: {
        type: Number,
        default: 1
    },
    created_by: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})