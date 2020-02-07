const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const DishSuggestionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    ingredients: {
        type: [String],
        default: []
    },
    cuisines: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    reciepes: {
        type: [String],
        default: []
    },
    categories: {
        type: [String],
        default: []
    },
    description: {
        type: String
    },
    saves: {
        type: [String],
        default: []
    },
    shares: [String],
    slug: String,
    calories: Number, //in Kcal
    isVeg: {
        type: Boolean,
        required: true,
        default: true
    },
    created_by: {
        type:String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const DishSuggestion = resources.model('DishSuggestion', DishSuggestionSchema)
module.exports = DishSuggestion