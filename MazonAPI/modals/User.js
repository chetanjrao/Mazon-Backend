var mongoose = require('mongoose');
const {
    resources
} = require('../helpers/dbHelper')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    registrationTime: {
        type: String
    },
    lastLoginTime: {
        type: String
    },
    image: {
        type: String
    },
    userType: {
        type: Number,
        required: true,
        default: 1
    },
    bookings: [
        {
            type: String
        }
    ],
    inorders: [
        {
            type: String
        }
    ],
    savedRestaurants: [
        {
            type: String
        }
    ],
    savedFood: [
        {
            type: String
        }
    ],
    hasbeenDeactivated: {
        type: Boolean,
        default: false
    },
    ratingsAndReviews: [
        {
            type: String
        }
    ],
    emailVerificationToken: {
        type: String
    },
    walletID: {
        type: String,
    },
    walletToken: {
        type: String
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