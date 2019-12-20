/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const Users = require('../models/User')
const bcrypt = require('bcrypt')
const AccessToken = require('../models/AccessToken')
const RefreshToken = require('../models/RefreshToken')
const {
    create_email_verification,
    get_user_details_by_email_or_mobile,
    get_user_details_by_email,
    create_mobile_otp
} = require('../services/user.service')
const {
    create_wallet,
    create_wallet_access_token,
} = require('../services/wallet.service')

const oauth_middleware = async (req, res, next) => {
    try {
        const request_header = req.headers["authorization"]
        const scope = req.body["scope"]
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
                                "status": 403
                            })
                        } else {
                            res.locals["user"] = access_token_document["username"]
                            const current_user = await get_user_details_by_email(access_token_document["username"])
                            res.locals["user_id"] = current_user["_id"]
                            next()
                        }
                    } else {
                        res.status(401)
                        res.json({
                            "message": "Tokens expired",
                            "status": 401
                        })
                    }
                } else {
                    console.log("ACCESS_TOKEN_MISSING")
                    res.status(403)
                    res.json({
                        "message": "Forbidden",
                        "status": 403
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
            console.log("hello")
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
    
}

module.exports = {
    signin: async (req, res, next) => {
        var authroizationHeader = req.headers["authorization"];
        var base64AuthData = authroizationHeader.substring(6)
        var authorizationArray = decodeBase64toString(base64AuthData)
        var authorization_split = authorizationArray.split(":")
        var email = authorization_split[0]
        var password = authorization_split[1]
        const user = await Users.findOne({
            'email': {
                $in: [email]
            }
        })
        if(user != null){
                var hashedPassword = user["password"]
                if(bcrypt.compareSync(password, hashedPassword)){
                        const access_tokens = await AccessToken.find({
                            "username": email
                        }).sort({
                            "created_at": -1
                        })
                        const refresh_tokens = await RefreshToken.find({
                            "username": email
                        }).sort({
                            "created_at": -1
                        })
                        const current_access_token = access_tokens[0]["access_token"]
                        const current_refresh_token = refresh_tokens[0]["refresh_token"]
                        res.json({
                            "message": "Logged in successfully as " + user["name"],
                            "status": 200,
                            "access_token": current_access_token,
                            "refresh_token": current_refresh_token
                        })
                }else {
                    res.status(401)
                        res.json({
                            "status": 401,
                            "message": "Invalid Username or Password"
                        })
                }
            }else {
                res.status(401)
                    res.json({
                        "status": 401,
                        "message": "Invalid Username or Password"
                    })
            }
    },
    signup: async (req, res, next)=>{
        const name = req.body["name"]
        const email = req.body["email"]
        const password = req.body["password"]
        const mobile = req.body["mobile"]
        const device_id = req.body["device_id"]
        const latitude = req.body["latitude"]
        const longitude = req.body["longitude"]
        const requesting_client = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const encrypted_password = bcrypt.hashSync(password, 10) 
        const current_user_check = await get_user_details_by_email_or_mobile(email, mobile)
        if(current_user_check == null){
            const new_user_document = new Users({
                first_name: name,
                email: email,
                password: encrypted_password,
                mobile: mobile,
                device_id: [device_id]
            })
            const new_user = await new_user_document.save()
            if(new_user != null){
                const mobile_otp = create_mobile_otp(new_user["_id"], mobile, "verification")
                // TODO: Send otp here
                const email_verification = await create_email_verification(email, new_user["_id"])
                // TODO: Send Email about verification Token
                // const new_wallet = await create_wallet(new_user["_id"], ip, latitude, longitude, requesting_client)
                // const wallet_access_token_creation = create_wallet_access_token(new_user["_id"], new_wallet["_id"])
                if(email_verification != null){
                    res.json({
                        "message": "User registered successfully. Verification link sent to email",
                        "status": 200
                    })
                } else {
                    res.json({
                        "message": "User registered successfully. Couldn't send verification link",
                        "status": 200
                    })
                }
                //TODO: perform series of oauth 2.0 and wallet generation methods
            }
        } else {
            res.status(403)
            res.json({
                "message": "Mobile or Email Address already exists",
                "status": 403
            })
        }
        
    },
    "token_middleware": oauth_middleware
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}
