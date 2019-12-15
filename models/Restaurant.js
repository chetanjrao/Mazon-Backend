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
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
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
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    primary_contact: {
        type: String,
        required: true
    },
    alternate_contact: {
        type: String
    },
    foodType: {
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
    payment: {
        account_no: {
            type: String
        },
        ph_no: {
            type: String
        },
        ifsc_code: {
            type: String
        },
        holder_name: {
            type: String
        },
        upi_id: {
            type: String
        }
    },
    offers: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: true
    },
    noOfTables: {
        type: Number,
        required: true
    },
    cuisines: {
        type: [String],
        default: []
    },
    facilities: {
        type: [String],
        default: []
    },
    created_by: {
        type: String,
        required: true
    },
    onBoardTime: {
        type: Date,
        default: new Date()
    }
})
const RestaurantModel = resources.model('Restaurant', restaurantSchema)
module.exports = RestaurantModel