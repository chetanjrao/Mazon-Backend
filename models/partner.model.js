const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const PartnerSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    is_confirmed: {
        is_confirmed: {
            type: Boolean,
            default: false
        },
        confirmed_by: {
            type: String
        },
        confirmed_at: {
            type: Date
        }
    },
    is_disabled: {
        is_disabled: {
            type: Boolean,
            default: false
        },
        disabled_by: {
            type: String
        },
        disabled_at: {
            type: Date
        }
    },
    created_at: {
        type: Date,
        required: new Date()
    },
})

const Partner = resources.model('Partner', PartnerSchema)

module.exports = Partner