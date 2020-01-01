const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')  

const FoodTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    created_by: {
        type: String,
        required: true
    }
})

const FoodType = resources.model('FoodType', FoodTypeSchema)

module.exports = FoodType