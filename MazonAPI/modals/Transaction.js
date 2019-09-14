const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Transaction = new Schema({
    transactionID: {
        type: String,
    },
    purpose: {
        type: String
    },
    amount: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    dateTime: {
        type: String
    },
    ip: {
        type: String
    }
})


module.exports = Transaction