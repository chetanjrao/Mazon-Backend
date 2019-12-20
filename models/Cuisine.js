const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const CuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
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

const Cuisine = resources.model('Cuisine', CuisineSchema)
module.exports = Cuisine