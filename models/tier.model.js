var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/db.helper')

const TierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    reward: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sub_name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    restaurant_ratings: {
        type: Number,
        required: true
    },
    food_ratings: {
        type: Number,
        required: true
    },
    inorders: {
        type: Number,
        required: true
    },
    bookings: {
        type: Number,
        required: true
    },
    referrals: {
        type: Number,
        required: true
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

const Tier = resources.model('Tier',TierSchema)
module.exports = Tier