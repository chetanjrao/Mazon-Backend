/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const Users = require('../models/user.model')
const ERROR_CODES = require('../helpers/constants.helper')
const OTP_SCOPES = require('../helpers/scopes.helper')
const msg91 = require('msg91-node-v2')
const MSG91 = new msg91("213839A7aBh3zS5aec5fc4")
const multer = require('multer')
const {
    create_trending
} = require('../services/trending.service')
const {
    storage
} = require('../helpers/utils.helper')

const {
    generate_alphanumeric_otp
} = require('../services/utils.service')
const {
    create_otp,
    validate_otp,
    invalidate_otp
} = require('../services/otp.service')
const {
    mailer
} = require('../helpers/utils.helper')
const {
    create_accesstoken,
    validate_accesstoken,
    revoke_accesstokens
} = require('../services/accesstoken.service')
const {
    create_refreshtoken,
    validate_refreshtoken,
    revoke_refreshtokens
} = require('../services/refereshtoken.service')
const {
    get_offer_details,
    check_offer
} = require('../services/offer.service')
const {
    get_complete_profile
} = require('../services/user.service')
const {
    get_all_transactions
} = require('../services/transaction.service')
const {
    get_wallet_based_user
} = require('../services/wallet.service')
const hbs = require('nodemailer-express-handlebars')

mailer.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: './views/',
        layoutsDir: './views/',
        defaultLayout: 'otp.handlebars'
    },
    viewPath: './views/'
}))

const {
    OAuth2Client
} = require('google-auth-library')
const GOOGLE_OAUTH_CLIENT = new OAuth2Client()
const {
    get_user_details_by_email,
    get_user_details_by_email_or_mobile,
    get_user_strict
} = require('../services/user.service')
const {
    create_wallet,
} = require('../services/wallet.service')
const {
    create_passkey,
    validate_passkey,
    invalidate_passkey
} = require('../services/passkey.service')

module.exports = {
    signup: async (req, res, next)=>{
        const name = req.body["name"]
        const email = req.body["email"]
        const mobile = req.body["mobile"]
        const device_id = req.body["device_id"]
        const split_name = name.split(" ")
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        var first_name = "";
        var last_name = "";
        for(var i=0;i<split_name.length-1;i++){
            first_name += split_name[i] + " "
        } 
        last_name = split_name[split_name.length-1]
        const current_user_check = await get_user_details_by_email_or_mobile(email, mobile)
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
                const mail = {
                    from: "no-reply@mazonapp.com",
                    to: email,
                    subject: "Login to Mazon | Mazon Technologies Pvt. Ltd.",
                    template: "otp",
                    context: {
                        user: first_name,
                        otp: otp
                    }
                }
                mailer.sendMail(mail)
                create_wallet(new_user["_id"], ip, user_agent)
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
            const mail = {
                from: "no-reply@mazonapp.com",
                to: email,
                subject: "Login to Mazon | Mazon Technologies Pvt. Ltd.",
                template: "otp",
                context: {
                    user: user["first_name"],
                    otp: otp
                }
            }
            mailer.sendMail(mail)
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
    verifyotp: async (req, res, next) => {
        const otp = req.body["otp"]
        const scope = req.body["scope"]
        const grant = req.body["grant"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const is_valid_otp = await validate_otp(grant, otp, scope)
        if(is_valid_otp){
            const user = await get_user_details_by_email(grant)
            await invalidate_otp(grant, otp, scope)
            const passkey = await create_passkey(grant, "email", grant, ip, user_agent)
            if(passkey != null){
                res.json({
                    "message": "Logged in succesfully",
                    "first_name": user["first_name"],
                    "user_id": user["_id"],
                    "mobile": user["mobile"],
                    "passkey": passkey["passkey"],
                    "status": 200
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Invalid OTP",
                "status": 403
            })
        }
    },
    token: async (req, res, next) => {
        const passkey = req.headers["x-mazon-passkey"]
        const email = req.headers["x-mazon-user"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const validate_key = await validate_passkey(passkey, email)
        if(validate_key){
            await invalidate_passkey(passkey, email)
            const access_token = await create_accesstoken(email, user_agent, ip)
            const refresh_token = await create_refreshtoken(email, user_agent, ip)
            res.json({
                "access_token": access_token["access_token"],
                "refresh_token": refresh_token["refresh_token"],
                "message": "Tokens generated successfully",
                "status": 200
            })
        }else {
            res.status(401)
            res.json({
                "message": "Invalid passkey",
                "status": 401
            })
        }
    },
    validate_token: async(req, res, next)=>{
        const header = req.headers["authorization"]
        const user = req.headers["x-mazon-user"]
        const split = header.split(" ", 2)
        if(split[0] == "Bearer"){
            const is_token_valid = await validate_accesstoken(split[1], user)
            if(is_token_valid){
                const user_details = await get_user_details_by_email(user)
                if(user_details != null){
                    res.locals["user"] = user
                    res.locals["user_id"] = user_details["_id"]
                    next()
                } else {
                    res.status(403)
                    res.json({
                        "message": "Forbidden",
                        "status": 403
                    })
                }
            } else {
                res.status(401)
                res.json({
                    "message": "Invalid Credentials",
                    "status": 401
                })
            }
        } else {
            res.status(401)
            res.json({
                "message": "Invalid Credentials",
                "status": 401
            })
        }
    },
    check_offer: async (req, res, next) => {
        const user = req.headers["x-mazon-user"]
        const user_document = await get_user_details_by_email(user)
        const offer_code = req.query["offer_code"]
        const restaurant_id = req.query["restaurant"]
        const offer_details = await get_offer_details(offer_code)
        const user_avails = 0;
        if(offer_details != null){
            for(var i=0;i<user_document["offers_availed"].length;i++){
                if(user_document["offers_availed"][i] == offer_code){
                    user_avails += 1
                }
            }
            if(user_avails < offer_details["max_user_avails"]){
                const check_offer_validity = await check_offer(restaurant_id, offer_code)
                if(check_offer_validity){
                    res.json({
                        "message": "Valid coupon",
                        "description": offer_details["description"]
                    })
                }else {
                    res.status(403)
                    res.json({
                        "message": "Invalid Offer Code",
                        "status": 403
                    })
                }
            }
        } else {
            res.status(403)
            res.json({
                "message": "Invalid Offer Code",
                "status": 403
            })
        }
    },
    check_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        if(user["is_mobile_verified"]){
            res.send("true")
        } else {
            res.status(403)
            res.send("false")
        }
    },
    send_otp_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        const otp = generate_alphanumeric_otp(6)
        await create_otp(otp, user["mobile"], OTP_SCOPES.MOBILE_VERIFICATION)
        let otps = {
            "sender": "MAZONT",
            "route": "4",
            "country": "91",
            sms: [
                {
                    "message": `Hi, ${user["first_name"]}. Your OTP (One Time Password) is ${otp}. This otp can only be used once and is valid for 15 mins only.`,
                    to: [`${user["mobile"]}`]
                }
            ]
        }
        MSG91.send(otps).then((data)=>{
            console.log(data)
        })
        res.send("ok")
    },
    verify_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        const otp = req.body["otp"]
        const scope = req.body["scope"]
        const grant = req.body["grant"]
        const is_valid_otp = await validate_otp(grant, otp, scope)
        if(is_valid_otp){
            await invalidate_otp(grant, otp, scope)
            await user.updateOne({
                $set: {
                    "is_mobile_verified": true,
                    "updated_at": new Date(),
                    "updated_by": user["_id"]
                }
            })
            res.send("ok")
        } else {
            res.status(401)
            res.json({
                "message": "Invalid OTP",
                "status": 401
            })
        }
    },
    create_trending_con: async (req, res, next) => {
        const uploader = multer({
            storage: storage
        }).array("images[]")
        let images = []
        const created_by = res.locals["user_id"]
        const email = res.locals["user"]
        uploader(req, res, async function(err){
        const dish_id = req.body["dish_id"]
        const restaurant_id = req.body["restaurant_id"]
        const latitude = req.body["latitude"]
        const longitude = req.body["longitude"]
        const contact = req.body["contact"]
        const rating = req.body["rating"]
        const review = req.body["review"]
        const restaurant_name = req.body["restaurant_name"]
        const dish_name = req.body["dish_name"]
        const isVeg = req.body["isVeg"]
        const address = req.body["address"]
        for(let i=0;i<req.files.length;i++){
            images.push(req.files[i]["path"])
        }
        await create_trending(dish_id, latitude, rating, review, longitude,created_by, email , restaurant_id, contact, restaurant_name, dish_name, isVeg, images, address)
        res.send("ok")
        })
        
    },
    profile: async (req, res, next) => {
        const user = await get_complete_profile(res.locals["user"], res.locals["user_id"])
        res.json(user)
    },
    wallet: async (req, res, next) => {
        const user_id = res.locals["user_id"]
        const user = res.locals["user"]
        const wallet = await get_wallet_based_user(user_id)
        const transactions = await get_all_transactions(user_id)
        res.json({
            wallet,
            transactions
        })
    }
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}
