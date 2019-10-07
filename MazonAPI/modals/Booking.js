/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const mongoose = require('mongoose');
const {
    resources
} = require('../helpers/dbHelper')

const BookingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    restaurant: {
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
    token: {
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
        required: true,
        
        default: 0
    }
})


const Booking = resources.model('Booking', BookingSchema)
module.exports = Booking