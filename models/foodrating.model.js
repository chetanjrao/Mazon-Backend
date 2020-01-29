const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const FoodRatingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    dish_id: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    },
    reference: String,
    rating: {
        type: Number,
        required: true
    },
    apetite: {
        type: Number
    },
    satisfaction: {
        type: Number
    },
    review: {
        type: String
    },
    images: {
        type: [String],
        default: []
    },
    email: {
        type: String,
        required: true
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

const FoodRating = resources.model('FoodRating', FoodRatingSchema)
module.exports = FoodRating