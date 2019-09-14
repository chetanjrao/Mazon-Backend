const mongoose = require('mongoose')

const Combination = new mongoose.Schema({
    menu: {
        type: [String]
    },
    restaurantID: {
        type: String,
        required: true
    },
    isManager: {
        type: Boolean,
        required: true
    },
    refID: {
        type: String,
        required: true
    },
    timeOfCreation: {
        type: String,
        required: true,
        default: new Date().toUTCString()
    },
    menuPrice: {
        type: String,
        required: true
    },
    isMenuVegOnly: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = Combination