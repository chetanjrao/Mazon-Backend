const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const NotificationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    notification: {
        type: String,
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number, //1) inorder 2) Booking 3) Wallet 4) Notice
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Notifications = resources.model('Notification', NotificationSchema)
module.exports = Notifications