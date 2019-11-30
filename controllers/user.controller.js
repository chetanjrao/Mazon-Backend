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
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
    } catch (error) {
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
    "token_middleware": oauth_middleware
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}
