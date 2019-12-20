const mongoose = require('mongoose')
const {
    resources
} = require("../helpers/dbHelper")

const AnalyticsSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true
    },
    clicks: [
        {
            user: {
                type: String
            },
            time: {
                type: Date
            }
        }
    ],
    inorders: [
        {
            user: {
                type: String
            },
            time: {
                type: Date
            }
        }
    ],
    bookings: [{
        user: {
            type: String
        },
        time: {
            type: Date
        }
    }],
    ratingReviews: [{
        user: {
            type: String
        },
        time: {
            type: Date
        }
    }],
    scans: [{
        user: {
            type: String
        },
        time: {
            type: Date
        }
    }],
    created_at: {
        type: Date,
        default: new Date()
    }
}) 

const Analytics = resources.model("Analytics", AnalyticsSchema)

module.exports = Analytics