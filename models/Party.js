/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Party = new Schema({
    name: {
        type: String,
        required: true
    },
    incharge: {
        type: String,
        required: true
    },
    inchargeEmail: {
        type: String,
        required: true
    },
    inchargePhone: {
        type: String,
        required: true
    },
    noOfPeople: {
        type: Number,
        required: true,
        min: 20
    },
    vID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    timeOfBooking: {
        type: String,
        required: true,
        default: new Date()
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    tokenUsed: {
        type: String,
        required: true
    },
    partyCode: {
        type: String,
        required: true
    },
    offer: {
        type: String,
    },
    amount: {
        type: String,
    },

})