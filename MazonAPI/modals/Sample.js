const mongoose = require('mongoose')

const Sample = new mongoose.Schema({
    value: {
        type: Number,
    }
})

module.exports = Sample