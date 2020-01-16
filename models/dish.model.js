const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const DishSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    ingredients: {
        type: [String],
    },
    cuisines: {
        type: [String]
    },
    reciepes: {
        type: [String]
    },
    categories: {
        type: [String]
    },
    description: {
        type: String,
        required: true
    },
    saves: {
        type: [String],
        default: []
    },
    shares: [String],
    taste: {
        spicy: Number, //Range 0-3
        bitter: Number,
        sweet: Number,
        sour: Number,
        salty: Number,
        astringent: Number,
        umami: Number
    },
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

const Dish = resources.model('Dish', DishSchema)
module.exports = Dish