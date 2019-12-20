/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const mongoose = require('mongoose');
const {
    resources
} = require('../helpers/dbHelper')

const RatingReview = new mongoose.Schema({
    uID: { //User email to which the review is assigned
        type: String,
        required: true
    },
    type: { // Type of Review i) Food or ii) Restaurant
        type: Number,
        required: true
    },
    reviewDest: { // Restaurant ID or Food ID to which the review / rating is assigned
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        trim: true,
        required: true
    },
    apetite: {
        type: Number,
        default: 2 // 1) No 2) Somewhat 3) Yes
    },
    satisfaction: {
        type: Number, // 1) Not Satisfied 2) Somewhat Satisfied 3) Fully Satisfied
        default: 2
    },
    dateTime: {
        type:String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    updated_at: {
        type: Date,
    },
    updated_by: {
        type: String
    },
    remarks: {
        type: String
    }
})

const RatingReviewsModel = resources.model('RatingReviews', RatingReview)
module.exports = RatingReviewsModel