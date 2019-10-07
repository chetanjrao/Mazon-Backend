/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {
    resources
} = require('../helpers/dbHelper')

const TransactionSchema = new Schema({
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
        type: String, //1) CREDIT 2)DEBIT
        required: true
    },
    dateTime: {
        type: String
    },
    ip: {
        type: String
    }
})

const Transaction = resources.model('Transaction', TransactionSchema)
module.exports = Transaction