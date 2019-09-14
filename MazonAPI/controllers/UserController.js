/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const express = require('express')
const User = require('../modals/User')
const database = require('../helpers/dbHelper')
const UserDatabase = database["resources"].model('User', User)
const bcrypt = require('bcrypt')

module.exports = {
    signin: async (req, res, next) => {
        var authroizationHeader = req.headers["authorization"];
        var base64AuthData = authroizationHeader.substring(6)
        var authorizationArray = decodeBase64toString(base64AuthData)
        var email = sanitization(getUsernameAndPassword(authorizationArray).email)
        var password = sanitization(getUsernameAndPassword(authorizationArray).password)
        const user = await UserDatabase.findOne({
            'email': {
                $in: [email]
            }
        })
        users.findOne({'email':{ $in: [email] }}, function(err, data){
            if(err){
                console.log(err)
                res.json({
                    "status": 500,
                    "message": "Internal Server Error"
                }).sendStatus(500)
            } else if(data){
                var hashedPassword = data["password"]
                bcrypt.compare(password, hashedPassword, function(error, result){
                    var id = data._id
                    if(result === true){
                        oauth.findOne({"refIdentity": {
                            $in: [email]
                        }}, function(responseError, response){
                            if(responseError){
                                console.log(responseError)
                                res.json({
                                    "status": 500,
                                    "message": "Internal Server Error"
                                }).sendStatus(500)
                            } else if(response){
                                var decryptedId = DecryptForParams(response.accessToken).identity
                                if(decryptedId == id){
                                    res.status(200)
                                    res.json({
                                        "identity": response.refIdentity,
                                        "accessToken": response.accessToken,
                                        "refreshToken": response.refreshToken,
                                    })
                                }
                            } else {
                                var accessTokenPayload = {
                                    "usageType": TokenUsageTypes.ACCESS,
                                    "issuer": "Mazon",
                                    "identity": data._id,
                                    "expiry": ExpiryTimeGenerator(45*24*60*60*1000)
                                }
                                var refreshTokenPayload = {
                                    "usageType": TokenUsageTypes.REFRESH,
                                    "issuer": "Mazon",
                                    "identity": data._id,
                                    "expiry": ExpiryTimeGenerator(90*24*60*60*1000)
                                }
                                var accessToken = encrypt(JSON.stringify(accessTokenPayload))
                                var refreshToken = encrypt(JSON.stringify(refreshTokenPayload))
                                oauth.create(new oauth({
                                    refID: data._id,
                                    refIdentity: email,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken
                                }), function(inerr, inResp){
                                    if(inResp){
                                        res.json({
                                            "identity": email,
                                            "accessToken": accessToken,
                                            "refreshToken": refreshToken,
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(401)
                        res.json({
                            "status": 401,
                            "message": "Invalid Username or Password"
                        })
                    }
                })
            } else{
                res.status(401)
                res.json({
                    "status": 401,
                    "message": "Invalid Username or Password"
                })
            }
        })
    }
}