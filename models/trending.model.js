const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const TrendingSchema = new mongoose.Schema({
    dish_id: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    restaurant: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [] //Long, Lat
        }
    },
    created_by: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Trending = resources.model('Trending', TrendingSchema)
module.exports = Trending