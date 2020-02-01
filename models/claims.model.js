var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/db.helper')

const ClaimsSchema = new mongoose.Schema({
    tier: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Claims = resources.model('Claim', ClaimsSchema)
module.exports = Claims