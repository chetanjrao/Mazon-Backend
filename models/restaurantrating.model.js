const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const RestaurantRatingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    ambience: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hygiene: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    images: {
        type: [String],
        default: []
    },
    is_disabled: {
        is_disabled: {
            type: Boolean,
            default: false
        },
        disabled_by: String,
        disabled_at: Date
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const RestaurantRating = resources.model('RestaurantRating', RestaurantRatingSchema)
module.exports = RestaurantRating