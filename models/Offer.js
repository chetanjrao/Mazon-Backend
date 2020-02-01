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
    is_universal: {
        is_universal: {
            type: Boolean,
            default: true
        },
        applies_to: {
            type: [String],
            default: []
        }
    },
    is_discount: {
        is_discount: {
            type: Boolean,
            default: false
        },
        is_percent: {
            type: Boolean,
            default: false
        },
        discount_amount: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    min_amount: {
        type: Number,
        default: 0
    },
    offer_type: { 
        type: Number,
        default: 1
    },
    on_weekdays: {
        type: Boolean,
        required: true
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
            type: Boolean,
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