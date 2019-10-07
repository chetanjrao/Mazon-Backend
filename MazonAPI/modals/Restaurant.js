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
    id: {
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
    menu: [
        {
            fImage: {
                type: String,
                data: Buffer
            },
            isPopular: {
                type: String,
                required: true,
                default: false
            },
            fName: {
                type: String,
                required: true
            },
            fDescription: {
                type: String,
                required: true
            },
            fPrice: {
                type: Number,
                required: true
            },
            fHalfPrice: {
                type: Number
            },
            veg: {
                type: Boolean,
                required: true
            },
            fType: {
                type: Number,
                required: true
            },
            fCustom: {
                type: Boolean,
                default: false
            },
            fRatingReviews: [
                {
                    rId: Number,
                    rUser: Number,
                    rRating: Number,
                    rReview: String,
                    rTime: {
                        type: Date,
                        default: Date.now
                    },
                    isValid: {
                        type: Boolean,
                        default: true
                    }
                }
            ]
        }
    ],
    images: {
        type: Array,
        required: true
    },
    priceForTwo: {
        type: Number,
        required: true
    },
    combos: [Number],
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
    offers: [Number],
    description: {
        type: String,
        required: true
    },
    noOfTables: {
        type: Number,
        required: true
    },
    ratingReviews: [
        {
            id: Number,
            user: Number,
            rating: Number,
            review: String,
            time: {
                type: Date,
                default: Date.now
            },
            isValid: {
                type: Boolean,
                default: false
            }
        }
    ],
    cuisines: [Number],
    facilities: [Number],
    onBoardTime: {
        type: Date,
        default: new Date()
    }
})
const RestaurantModel = resources.model('Restaurant', restaurantSchema)
module.exports = RestaurantModel