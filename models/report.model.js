const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const ReportSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    report: {
        type: String,
        required: true
    },
    is_processed: false,
    created_at: {
        type: Date,
        default: new Date()
    }
})

const Report = resources.model("Report", ReportSchema)
module.exports = Report
