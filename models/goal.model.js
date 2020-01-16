const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const GoalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        type: Boolean,
        default: true
    },
    is_restricted: {
        type: Boolean,
        default: false
    },
    restricted_restaurants: {
        type: [String],
        default: []
    },
    created_by: {
        type: String,
        required: true,
        select: false
    },
    created_at: {
        type: Date
    }
})

const Goal = resources.model('Goal', GoalSchema)
module.exports = Goal