/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const express = require('express')
const Users = require('../modals/User')
const bcrypt = require('bcrypt')
const AccessToken = require('../modals/AccessToken')
const RefreshToken = require('../modals/RefreshToken')

module.exports = {
    signin: async (req, res, next) => {
        var authroizationHeader = req.headers["authorization"];
        var base64AuthData = authroizationHeader.substring(6)
        var authorizationArray = decodeBase64toString(base64AuthData)
        var email = sanitization(getUsernameAndPassword(authorizationArray).email)
        var password = sanitization(getUsernameAndPassword(authorizationArray).password)
        const user = await Users.findOne({
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