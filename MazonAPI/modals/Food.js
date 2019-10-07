/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const mongoose = require('mongoose')

const Food = new mongoose.Schema({
    fName: { 
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
    halfPrice: {
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