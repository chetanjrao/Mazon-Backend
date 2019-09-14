/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const mongoose = require('mongoose')

const Food = new mongoose.Schema({
    rId: { 
        type: String,
        required:true
    },
    name: { 
        type: String,
        required: true 
    },
    description: { 
        type: String 
    },
    price: {
        type:Number,
        required:true
    },
    hprice: {
        type: Number
    },
    veg: {
        type: Boolean,
        default:true,
        required:true
    },
    category: {
        type:Number,
        default:13,
        required:true
    },
    //Changes to be made in food model
    ratingReviews: {
        type:[Number],
    },
    orders: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    popularity: {
        type: Number,
        default: 5,
    },
    image: {
        type: String
    },
    isAvailable: {
        default: true,
        type: Boolean
    }

})

module.exports = Food