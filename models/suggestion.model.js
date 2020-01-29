const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const SuggestionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_onboarded: {
        type: Boolean,
        default: false
    },
    onboarded_as: {
        type: String
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number]
    },
    contact: {
        type: String
    },
    created_by: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    approved_by: {
        type: String
    },
    approved_at: {
        type: Date
    }
})

const Suggestion = resources.model('Suggestion', SuggestionSchema)
module.exports = Suggestion