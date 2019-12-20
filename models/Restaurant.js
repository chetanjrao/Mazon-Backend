/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema
const {
    resources
} = require('../helpers/dbHelper')

var restaurantSchema = new Schema({
    rId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: Number,
        required: true
    },
    locality: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDeliveryAvailable: {
        type: Boolean,
        required: true,
        default: false
    },
    bookingAvailable: {
        type: Boolean,
        required: true,
        default: false
    },
    popularity: {
        type: Number,
        default: 10
    },
    images: {
        type: [String],
        required: true
    },
    priceForTwo: {
        type: Number,
        required: true
    },
    coordinates: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    },
    phNo: {
        type: String,
        required: true
    },
    foodType: {
        type: String,
        required: true
    },
    telNo: {
        type: String,
        required: true
    },
    restaurantEmail: {
        type: String,
        required: true
    },
    //isOpen
    timing: {
        openTime: {
            type: String,
            required: true
        },
        closeTime: {
            type: String,
            required: true
        }
    },
    owner: {
        type: Number,
        required: true
    },
    offers: [String],
    description: {
        type: String,
        required: true
    },
    noOfTables: {
        type: Number,
        required: true
    },
    cuisines: [String],
    facilities: [String],
    onBoardTime: {
        type: Date,
        default: new Date()
    }
})
const RestaurantModel = resources.model('Restaurant', restaurantSchema)
module.exports = RestaurantModel