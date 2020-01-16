const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_by: {
        typ: String,
        required: true
    },
    created_at: {
        type: Date,
        deafult: new Date()
    }
})

const Category = resources.model('Category', CategorySchema)
module.exports = Category