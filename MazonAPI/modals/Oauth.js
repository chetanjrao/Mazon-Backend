var mongoose = require('mongoose')

const Oauth = new mongoose.Schema({
    refID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    refIdentity: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    mazonInorderToken: {
        type: String
    },
    mazonBookingsToken: {
        type: String
    },
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = Oauth