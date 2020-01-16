/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const ERROR_CODES = require('../helpers/constants.helper')
const Email = require('email-templates')
const OTP_SCOPES = require('../helpers/scopes.helper')
const {
    generate_alphanumeric_otp
} = require('../services/utils.service')
const {
    create_otp,
    validate_otp
} = require('../services/otp.service')
const {
    mailer
} = require('../helpers/utils.helper')

const email_template = new Email({
    message: {
        from: "no-reply@mazonapp.com"
    },
    send: false,
    transport: mailer,
    preview: true,
    htmlToText: false
})

const {
    OAuth2Client
} = require('google-auth-library')
const GOOGLE_OAUTH_CLIENT = new OAuth2Client()
const {
    create_email_verification,
    get_user_details_by_email_or_mobile,
    get_user_details_by_email,
    get_user_strict
} = require('../services/user.service')
const {
    create_wallet,
    create_wallet_access_token,
} = require('../services/wallet.service')
const {
    get_inorders_with_email_base
} = require('../services/inorder.service')
const {
    get_bookings_with_email_base
} = require('../services/booking.service')
const {
    get_user_rating_review,
    get_user_email_rating_review
} = require('../services/ratings.service')
const {
    get_wallet_based_user
} = require('../services/wallet.service')
const {
    create_passkey,
    validate_passkey
} = require('../services/passkey.service')

module.exports = {
    signup: async (req, res, next)=>{
        const name = req.body["name"]
        const email = req.body["email"]
        const mobile = req.body["mobile"]
        const device_id = req.body["device_id"]
        const split_name = name.split(" ")
        var first_name = "";
        var last_name = "";
        for(var i=0;i<split_name.length-1;i++){
            first_name += split_name[i] + " "
        } 
        last_name = split_name[split_name.length-1]
        const current_user_check = await get_user_details_by_email(email)
        if(current_user_check == null){
            const new_user_document = new Users({
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile: mobile,
                device_id: [device_id]
            })
            try{
                const new_user = await new_user_document.save()
                const otp = generate_alphanumeric_otp(6)
                await create_otp(otp, email, OTP_SCOPES.SIGNUP);
                email_template.send({
                    template: "signup",
                    message: {
                        to: email
                    },
                    locals: {
                        name: first_name,
                        otp: otp
                    }
                })
                create_wallet(new_user["_id"])
                res.json({
                    "message": "OTP sent to your registered email address",
                    "status": 200
                })
            } catch(REGISTRATION_FAILURE) {
                console.log(REGISTRATION_FAILURE)
                res.status(500)
                res.json({
                    "message": "Internal Server Error",
                    "status": 500,
                    "error_code": ERROR_CODES.REGISTRATION_ERROR
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Mobile or Email Address already exists",
                "status": 403,
                "error_code": ERROR_CODES.DOCUMENT_EXISTS
            })
        }
        
    },
    signinwithgoogle: async (req, res, next) => {
        const idtoken = req.body["id_token"]
        
    },
    token_middleware: async (req, res, next) => {
        try {
            const request_header = req.headers["authorization"]
            const scope = req.body["scope"]
            try{
            const split_header = request_header.split(" ", 2)
            if(split_header[0] == "Bearer"){
                try{
                    const access_token = split_header[1].trim()
                    const access_token_document = await AccessToken.findOne({
                        "access_token": access_token
                    })
                    if(access_token_document != null){
                        const now = new Date()
                        const expiry = access_token_document["expiry"]
                        if(now < expiry){
                            if(access_token_document["scopes"].indexOf(scope) === -1){
                                res.status(403)
                                res.json({
                                    "message": "Forbidden",
                                    "status": 403,
                                    "error_code": ERROR_CODES.INVALID_SCOPE
                                })
                            } else {
                                res.locals["user_id"] = access_token_document["user"]
                                const current_user = await get_user_strict(access_token_document["user"])
                                res.locals["user"] = current_user["email"]
                                next()
                            }
                        } else {
                            res.status(401)
                            res.json({
                                "message": "Tokens expired",
                                "status": 401,
                                "error_code": ERROR_CODES.TOKENS_EXPIRED
                            })
                        }
                    } else {
                        res.status(403)
                        res.json({
                            "message": "Forbidden",
                            "status": 403,
                            "error_code": ERROR_CODES.TOKEN_MISSING
                        })
                    }
                } catch(e) {
                    console.log(e)
                    res.status(403)
                    res.json({
                        "message": "Forbidden",
                        "status": 403
                    })
                }
            } else {
                res.status(403)
                res.json({
                    "message": "Forbidden",
                    "status": 403
                })
            } 
        } catch (HEADER_MISSING){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
        } catch (error) {
            console.log(error)
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
        
    },
    sendotp: async (req, res, next) => {
        const email = req.body["email"]
        const user = await get_user_details_by_email(email)
        if(user != null){
            const otp = generate_alphanumeric_otp(6)
            await create_otp(otp, email, OTP_SCOPES.SIGNIN)
            email_template.send({
                template: "otp",
                message: {
                    to: email
                },
                locals: {
                    name: user["name"],
                    otp: otp
                }
            })
            res.json({
                "message": "OTP has been sent to your email address",
                "status": 200
            })
        } else {
            res.status(403)
            res.json({
                "message": "User not found",
                "status": 403,
                "error_code": ERROR_CODES.DOCUMENT_NOT_FOUND
            })
        }
    },
    validateotp: async (req, res, next) => {
        const otp = req.body["otp"]
        const scope = req.body["scope"]
        const grant = req.body["grant"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const is_valid_otp = await validate_otp(grant, otp, scope)
        if(is_valid_otp){
            const user = await get_user_details_by_email(grant)
            const passkey = await create_passkey(user["_id"], "email", grant, ip, user_agent)
            if(passkey != null){
                res.json({
                    "message": "Logged in succesfully",
                    "passkey": passkey["passkey"],
                    "status": 200
                })
            }
        }
    }
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}
