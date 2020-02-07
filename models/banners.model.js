const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const BannerSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    created_at: new Date()
})

const Banner = resources.model('Banner', BannerSchema)
module.exports = Banner