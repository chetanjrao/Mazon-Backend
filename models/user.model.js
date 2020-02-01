var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/db.helper')

const User = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    referrer: "",
    password: {
        type: String,
    },
    offers_availed: [
        { offer_code: String, availed_at: Date }
    ],
    mobile: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    is_mobile_verified: {
        type: Boolean,
        default: false
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    cover_image: {
        type: String
    },
    image: {
        type: String
    },
    saved_restaurants: {
        type: [String],
        default: []
    },
    saved_food: {
        type: [String],
        default: []
    },
    device_id: {
        type: [String],
        default: []
    },
    food_preferences: {
        pure_veg: Boolean,
        cuisines: [String],
        categories: [String],
        taste: {
            spicy: Number,
            bitter: Number,
            sour: Number,
            sweet: Number,
            umami: Number,
            astringent: Number
        }
    },
    is_deactivated: {
        is_deactivated:  {
            type: Boolean,
            default: false
        },
        deactivated_by: {
            type: String
        },
        deativated_at: {
            type: Date
        }
    },
})

const UserCollection = resources.model('User', User)

module.exports = UserCollection