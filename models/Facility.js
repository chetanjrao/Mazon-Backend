const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const FacilitySchema = new mongoose.Schema({
    name: {
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

const Facility = resources.model('Facility', FacilitySchema)
module.exports = Facility