const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const CitySchema = new mongoose.Schema({
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

const City = resources.model('City', CitySchema)
module.exports = City