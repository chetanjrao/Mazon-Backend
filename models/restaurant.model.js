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
} = require('../helpers/db.helper')

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
    restaurant_type: {
        type: String
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    is_delivery_available: {
        type: Boolean,
        required: true,
        default: false
    },
    booking_available: {
        type: Boolean,
        required: true,
        default: false
    },
    inorder_available: {
        type: Boolean,
        default: false,
        required: true
    },
    popularity: {
        type: Number,
        default: 10
    },
    images: {
        type: [String],
        required: true
    },
    price_for_two: {
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
    is_pure_veg: Boolean,
    restaurant_email: {
        type: String,
        required: true
    },
    timing: {
        open_time: {
            type: String,
            required: true
        },
        close_time: {
            type: String,
            required: true
        }
    },
    payment: {
        payment_mode: {
            payment_id: {
                type: String
            },
            mobile: {
                type: String
            },
            ifsc_code: {
                type: String
            },
            beneficiary_name: {
                type: String
            }
        },
    },
    description: {
        type: String,
        required: true
    },
    no_of_tables: {
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
    cgst: {
        type: Number,
        default: 6
    },
    sgst: {
        type: Number,
        default: 6
    },
    service_charge: {
        type: Number
    },
    created_by: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})
const RestaurantModel = resources.model('Restaurant', restaurantSchema)
module.exports = RestaurantModel