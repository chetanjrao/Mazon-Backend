const mongoose = require('mongoose')
const Users = require('../models/user.model')
const uuid = require('uuid/v4')
const EmailVerification = require('../models/emailverification.model')
const Otp = require('../models/otp.model')
const {
    get_inorders_with_email
} = require('./inorder.service')
const {
    get_bookings_with_email
} = require('./booking.service')
const {
    get_user_rating_review
} = require('./ratings.service')
const {
    generate_otp
} = require('./utils.service')

const get_user_details = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
    if(user["_id"] != undefined){
        return {
            "email": user["email"],
            "mobile": user["mobile"],
            "name": user["name"],
            "is_premium": user["isPremium"],
            "last_login_time": user["lastLoginTime"]
        }
    } else {
        const error = new Error("Invalid User Requested")
        error.status = 400
        throw error
    }
}
const get_user = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
   return user
}

const get_user_strict = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    }, {
        "password": 0,
        "device_id": 0,
        "created_at": 0,
        "userType": 0,
        "is_deactivated": 0,
        "registrationTime": 0,
        "__v": 0
    })
   return user
}
const get_user_details_by_email = async (email) => {
    const user = await Users.findOne({
        "$and": [
            {
                "email": email
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
    return user
}

const get_user_details_by_email_or_mobile = async (email='', mobile='') => {
    const user = await Users.findOne({
        $or: [
            {
                "email": email
            },
            {
                "mobile": mobile
            }
        ]
    })
    if(user != null){
        return {
            "_id": user["_id"],
            "email": user["email"],
            "mobile": user["mobile"],
            "name": user["name"],
            "is_premium": user["isPremium"],
            "last_login_time": user["lastLoginTime"]
        }
    }
    return null
}

const get_complete_profile = async (email, user_id) => {
    const inorders = await get_inorders_with_email(email)
    const bookings = await get_bookings_with_email(email)
    const rating_reviews = await get_user_rating_review(user_id)
    const user_details = await get_user_strict(user_id)
}

const create_email_verification = async (email, user) => {
    const token = uuid()
    const now = new Date()
    now.setHours(now.getHours() + 1)
    const expiry = new Date(now)
    const new_email_verification_token_document = new EmailVerification({
        token: token,
        expiry: expiry,
        email: email,
        user: user
    })
    const new_email_verification = await new_email_verification_token_document.save()
    //TODO:  Send the email
    return new_email_verification
}

module.exports = {
    get_user_details,
    get_user_details_by_email,
    create_email_verification,
    get_user_details_by_email_or_mobile,
    get_user,
    get_user_strict
}