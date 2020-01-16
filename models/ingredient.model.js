const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')  

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    created_by: {
        type: String,
        required: true
    },
    foods: {
        type: [String],
        default: []
    }
})

const Ingredient = resources.model('Ingredient', IngredientSchema)

module.exports = Ingredient