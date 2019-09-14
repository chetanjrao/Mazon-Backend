/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const mongoose = require('mongoose')
const database = require('../helpers/dbHelper')
const OauthClient = require('../modals/OauthClient')
const OauthAuthorization = require('../modals/OauthAuthorization')
const User = require('../modals/User')
const UserCollection = database["resources"].model('User', User)
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const crypto = require('crypto')
const uuid = require('uuid/v4')
const AccessToken = require('../modals/AccessToken')
const RefreshToken = require('../modals/RefreshToken')

module.exports = {
    register: async (req, res, next) => {
        var package_identifier = req.body.package_identifier;
        var client_type = req.body.client_type;
        var authorization_url = req.body.authorization_url;
        var description = req.body.description;
        var project_name = req.body.project_name;
        var project_id = req.body.project_id;
        var time_of_creation = new Date()
        var scopes = req.body.scopes
        var home_page_url = req.body.home_page_url
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorizationdecoded = decodeBase64toString(authorization_string)
        var authorization_split = authorizationdecoded.split(':')
        var username = authorization_split[0]
        var userpassword = authorization_split[1]
        var developer_name = req.body.developer_name
        const user = await UserCollection.findOne({
            "email": username
        })
        if(user != undefined){
            if(bcrypt.compareSync(userpassword, user["password"])){
                const oauth_check = await OauthClient.find({ 
                    "$or": [
                        {
                            "project_id": project_id
                        },
                        {
                            "package_identifier": package_identifier
                        }
                    ]
                });
                if(oauth_check.length > 0){
                    const err = new Error("Oauth Client already present. Invalid Project ID or Package Indentifier")
                    err.status = 403
                   next(err)
                } else {
                    var client_id = project_id + ".mazonapp.com"
                    var client_secret = crypto.randomBytes(16).toString('hex')
                    const newOauthClient = new OauthClient({
                        client_id: client_id,
                        package_identifier: package_identifier,
                        client_type: client_type,
                        client_secret: client_secret,
                        authorization_url: authorization_url,
                        description: description,
                        project_name: project_name,
                        project_id: project_id,
                        scopes: scopes,
                        home_page_url: home_page_url,
                        email: username,
                        developer_name: developer_name
                    })
                    const oauth_client = await newOauthClient.save()
                    if (oauth_client != undefined && oauth_client != {})
                    res.json({
                        "message": "Client Registered",
                        "status": 201,
                        "client_secret": client_secret,
                        "client_id": client_id
                    })
                }
            } else {
                //Error Handling : 401 Unauthorized
                console.log("unauthorized")
            }
        }
    },
    authorize: async (req, res, next) => {
        const response_type = 'code'
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorization_split = authorization_string.split(':')
        var username = authorization_split[0]
        var password = authorization_split[1]
        var client_id = req.params.clientid
        var redirect_uri = req.params.redirect_uri
        var scopes = req.params.scopes
        var state = req.params.state
        var client_type = req.params.client_type
        var code_challenge = req.params.code_challenge
        var code_challenge_method = req.params.code_challenge_method
        var requesting_client = req.headers["user-agent"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var referrer = req.headers.referrer || req.headers.referer
        const oauth_client_check = await OauthClient.findOne({'client_id': client_id})
        if(oauth_client_check != undefined || oauth_client_check == {}){
            const error = new Error("Requested Oauth client does not exist")
            error.status = 400
            next(error)
        } else {
            const user = await UserCollection.findOne({
                'email': username
            })
            if(user != undefined || user == {}){
                const error = new Error("Invalid Username/Password")
                error.status = 401
                next(error)
            } else {
                userpassword = user["password"]
                if(bcrypt.compareSync(password, userpassword)){
                    const authorization_code = uuid()
                    const now = new Date()
                    now.setMinutes(now.getMinutes() + 5)
                    const expiry = new Date(now);
                    const parsed_scopes = JSON.parse(scopes)
                    const client_scopes = oauth_client_check["scopes"]
                    if(checkScopes(parsed_scopes, client_scopes)){
                        const newOuthAuthorization = new OauthAuthorization({
                            client_id: client_id,
                            redirect_uri: redirect_uri,
                            scopes: scopes,
                            state: state,
                            client_type: client_type,
                            code_challenge: code_challenge,
                            code_challenge_method: code_challenge_method,
                            requesting_client: requesting_client,
                            referrer: referrer,
                            authorization_code: authorization_code,
                            expires_in: expiry,
                            identity: username,
                            user_ip: ip
                        })
                        const oauth_auth_code = newOuthAuthorization.save()
                        if(oauth_auth_code != undefined && oauth_auth_code != {}){
                            res.json({
                                "message": "Authorization Code valid for 5 minutes",
                                "response_type": response_type,
                                "client_id": client_id,
                                "redirect_uri": redirect_uri,
                                "scopes": scopes,
                                "state": state,
                                "code": authorization_code,
                                "identity": username
                            })  
                        }
                    } else {
                        const error = new Error("Invalid Scopes Requested")
                        error.status = 403
                        next(error)
                    }
                } else {
                    const error = new Error("Invalid Username/Password")
                    error.status = 401
                    next(error)
                }
            }
        }
    },
    token: async (req, res, next) => {
        const grant_type = 'authorization_code'; // 2) Password 3) Client Credentials
        var client_id = req.body.client_id;
        var client_secret = req.body.client_secret;
        var redirect_uri = req.body.redirect_uri;
        var code = req.body.authorization_code;
        var username = req.body.username;
        var client_type = req.body.client_type
        var user_agent = req.headers["user-agent"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const oauth_client_check = await OauthClient.findOne({
            "$and": [
                {
                    "client_id": client_id
                },
                {
                    "client_secret": client_secret
                }
            ]
        })
        if(oauth_client_check != undefined && oauth_client_check != {}){
            const code_docs_check = await OauthAuthorization.findOne({
                "$and": [
                    {
                        'authorization_code': code
                    },
                    {
                        "client_id": client_id
                    }
                ]
            })
            if(code_docs_check != undefined && code_docs_check != {}){
                var expiry = code_docs_check["expires_in"]
                const now = new Date()
                if(now < expiry){
                    const current_scopes = oauth_client_check["scopes"]
                    var now_access = new Date()
                    now_access.getMinutes(now_access.getDate() + 45)
                    const access_token_expiry = new Date(now_access)
                    const now_refresh = new Date()
                    now_refresh.setDate(now_refresh.getDate() + 155)
                    const refresh_token_expiry = new Date(now_refresh)
                    const access_token = crypto.randomBytes(24).toString('hex')
                    const refresh_token = crypto.randomBytes(24).toString('hex')
                    const new_access_token = new AccessToken({
                        access_token: access_token,
                        expiry: access_token_expiry,
                        client_id: client_id,
                        grant_type: grant_type,
                        grant_value: code,
                        scopes: current_scopes,
                        username: username,
                        client_type: client_type,
                        token_type: "bearer",
                        user_agent: user_agent,
                        user_ip: ip
                    })
                    const access_token_document = await new_access_token.save()
                    const new_refresh_token = new RefreshToken({
                        refresh_token: refresh_token,
                        expiry: access_token_expiry,
                        client_id: client_id,
                        grant_type: grant_type,
                        grant_value: code,
                        scopes: current_scopes,
                        username: username,
                        client_type: client_type,
                        token_type: "refresh",
                        user_agent: user_agent,
                        user_ip: ip
                    })
                    const refresh_token_document = await new_refresh_token.save()
                    if((access_token_document != undefined && access_token_document != {}) && (refresh_token_document != undefined && refresh_token_document != {})){
                        res.json({
                            "scopes": current_scopes,
                            "expiry": 3600,
                            "token_type": "bearer",
                            "access_token": access_token,
                            "refresh_token": refresh_token
                        })
                    } else {
                        const error = new Error("Internal Server Error")
                        error.status = 500
                        next(error)
                    }
                } else {
                    const error = new Error("Authorization Code Expired")
                    error.status = 400
                    next(error)
                }
            }
        } else {
            const error = new Error("Invalid Client Credentials")
            error.status = 401
            next(error)
        }
    },
    refresh: async (req, res, next) => {
        
    },
    revoke: async (req, res, next) => {
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorization_split = authorization_string.split(':')
        var client_id = authorization_split[0]
        var client_secret = authorization_split[1]
        var project_id = req.body.project_id
        // TODO: Delete all oauth tokens related to the respective Project ID
    },
    delete: async (req, res, next) => {
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorization_split = authorization_string.split(':')
        var client_id = authorization_split[0]
        var client_secret = authorization_split[1]
        var project_id = req.body.project_id
        // TODO: Delete the client project and all oauth tokens i.e., access and refresh related to the respective Project ID
    }
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}

const checkScopes = (requested_scopes, client_scopes) => {
    for(var i=0; i<requested_scopes.length; i++){
        if(client_scopes.indexOf(requested_scopes[i]) === -1){
            return false
        }
    }
    return true
}