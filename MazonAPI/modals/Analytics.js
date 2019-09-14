const mongoose = require('mongoose')

const Analytic = new mongoose.Schema({
    destinationID: {
        type: String,
        required: true
    },
    clicks: [String], // The time stamp converted to Indian Time will get inserted
    inorders: [String],
    bookings: [String],
    ratingReviews: [String],
    scans: [String]
}) 

module.exports = Analytic