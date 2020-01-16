var mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const SettlementsSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    inorder_token: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    is_setteled: {
        type: Boolean,
        default: false
    },
    settled_by: {
        type: String
    },
    settled_at: {
        type: Date
    }
})

const Settlements = mongoose.model('Settlement', SettlementsSchema)
module.exports = Settlements