/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const mongoose = require('mongoose');


const RatingReview = new mongoose.Schema({
    uID: { //User ID to which the review is assigned
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
    dateTime: {
        type:String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: false
    },
    isRemoved: {
        type: Boolean,
        default: false
    }
})

const RatingReviewsModel = mongoose.model('RatingReviews', RatingReview)
module.exports = RatingReviewsModel