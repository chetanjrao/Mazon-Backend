const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Socket = new Schema({
    deviceID: {
        type: String,
        required: true
    },
    connectionID: {
        type: String,
        required: true
    },
    refID: {
        type: String,
        required: true
    },
    timeOfRecentConnection: {
        type: Number,
        required: true,
        default: new Date().toUTCString()
    }
})

module.exports = Socket