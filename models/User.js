var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/dbHelper')

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
    password: {
        trim: true,
        type: String,
        required: true
    },
    address: {
        home: {
            address: {
                type: String
            },
            location: {
                type: {
                    type: String,
                },
                coordinates: {
                    latitude: {
                        type: Number
                    },
                    longitude: {
                        type: Number
                    }
                }
            }
        },
        office: {
            address: {
                type: String
            },
            location: {
                type: {
                    type: String,
                },
                coordinates: {
                    latitude: {
                        type: Number
                    },
                    longitude: {
                        type: Number
                    }
                }
            }
        },
    },
    mobile: {
        type: String,
        required: true
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
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
    userType: {
        type: Number,
        default: 1
    },
    savedRestaurants: {
        type: [String],
        default: []
    },
    savedFood: {
        type: [String],
        default: []
    },
    device_id: {
        type: String,
        required: true
    },
    is_deactivated: {
        is_deactivated:  {
            type: Boolean,
            default: false
        },
        deativated_at: {
            type: Date
        }
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumRefNo: {
        type: String
    }
})

const UserCollection = resources.model('User', User)

module.exports = UserCollection