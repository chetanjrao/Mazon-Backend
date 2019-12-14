const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const OfferSchema = new mongoose.Schema({
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
    availed_by: {
        type: [String],
        default: []
    },
    is_approved: {
        is_approved: {
            type: Boolea,
            default: false
        },
        approved_by: {
            type: String,
        },
        approved_at: {
            type: Date
        }
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Offer = resources.model('Offer', OfferSchema)

module.exports = Offer