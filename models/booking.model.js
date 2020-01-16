/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose');
const {
    resources
} = require('../helpers/db.helper')

const BookingSchema = new mongoose.Schema({
    rId: {
        type: String,
        required: true
    },
    email: {
        trim: true,
        type: String,
        required: true
    },
    phone: {
        trim: true,
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    male: {
        type: Number,
        required: true,
        default: 0
    },
    female: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String,
        required: true
    },
    coupon: {
        type: String
    },
    status: {
        /**
         * 1-> Pending
         * 2-> Confirmed
         * 3-> Active
         * 4-> Completed
         * 5-> Cancelled
         */
        type: Number,
        default: 1
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String
    },
    payment_mode: {
        type: String //1) Credit Card/Debit Card 2)Paytm/UPI/G.Pay/PhonePe 3)Cash
    },
    device_id: {
        type: [String],
        default: []
    },
    last_updated: {
        type: Date,
        default: new Date()
    },
    last_updated_by: {
        type: String
    }
})


const Booking = resources.model('Booking', BookingSchema)
module.exports = Booking