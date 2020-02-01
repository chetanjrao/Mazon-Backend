var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/db.helper')

const FeedbackSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    images: [],
    like: {
        type: String
    },
    improvement: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Feedback = resources.model('Feedback', FeedbackSchema)
module.exports = Feedback 