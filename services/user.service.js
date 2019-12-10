const mongoose = require('mongoose')
const Users = require('../models/User')
const uuid = require('uuid/v4')
const EmailVerification = require('../models/EmailVerification')
const MobileOTP = require('../models/MobileOTP')
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
                "hasbeenDeactivated": false
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
const get_user_details_by_email = async (email) => {
    const user = await Users.findOne({
        "$and": [
            {
                "email": email
            },
            {
                "hasbeenDeactivated": false
            }
        ]
    })
    if(user["_id"] != undefined){
        return {
            "_id": user["_id"],
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

const create_mobile_otp = async (user, mobile, scope) => {
    const otp = Number.parseInt(generate_otp(6))
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    const expiry = new Date(now)
    const mobile_otp_document = new MobileOTP({
        user: user,
        mobile: mobile,
        otp: otp,
        scope: scope,
        expiry: expiry
    })
    const mobile_otp = await mobile_otp_document.save()
    //TODO: Send the mobile OTP
    return mobile_otp
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

const verify_email = async (token, email) => {
    const verification_document = await EmailVerification.findOne({
        "token": token,
        "email": email
    })
    const now = new Date()
    if(now < verification_document["expiry"]){
        return true
    }
    return false
}

const verify_otp = async (otp, mobile, scope) => {
    const otp_document = await MobileOTP.findOne({
        "otp": otp,
        "mobile": mobile,
        "scope": scope
    })
    const now = new Date()
    if(now < otp_document["expiry"]){
        return true
    }
    return false
}

module.exports = {
    get_user_details,
    get_user_details_by_email,
    create_email_verification,
    get_user_details_by_email_or_mobile,
    create_mobile_otp,
    verify_email,
    verify_otp
}