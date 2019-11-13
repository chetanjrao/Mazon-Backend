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
    reference: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String, //1) CREDIT 2)DEBIT
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    coordinates: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    is_op_success: {
        type: Boolean
    },
    ip: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    }
})

const Transaction = resources.model('Transaction', TransactionSchema)
module.exports = Transaction