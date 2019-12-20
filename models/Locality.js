const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const LocalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    city: {
        type: String,
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

const Locality = resources.model('Locality', LocalitySchema)
module.exports = Locality