/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const OauthClient = require('../models/OauthClient')
const OauthAuthorization = require('../models/OauthAuthorization')
const Users = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const uuid = require('uuid/v4')
const AccessToken = require('../models/AccessToken')
const RefreshToken = require('../models/RefreshToken')

module.exports = {
    register: async (req, res, next) => {
        var package_identifier = req.body.package_identifier;
        var client_type = req.body.client_type;
        var authorization_url = req.body.authorization_url;
        var description = req.body.description;
        var project_name = req.body.project_name;
        var project_id = req.body.project_id;
        var scopes = req.body.scopes;
        var home_page_url = req.body.home_page_url
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorizationdecoded = decodeBase64toString(authorization_string)
        var authorization_split = authorizationdecoded.split(':')
        var username = authorization_split[0]
        var userpassword = authorization_split[1]
        var developer_name = req.body.developer_name
        const user = await Users.findOne({
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
                    res.status(403)
                    res.json({
                        "message": "Oauth Client already present. Invalid Project ID or Package Indentifier",
                        "status": "403"
                    })
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
                    if (oauth_client["_id"] != undefined)
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
        var authorization_string = authorization_header.substring(6, authorization_header.length)
        var authorizationdecoded = decodeBase64toString(authorization_string)
        var authorization_split = authorizationdecoded.split(':')
        var username = authorization_split[0]
        var password = authorization_split[1]
        var client_id = req.body.client_id
        var redirect_uri = req.body.redirect_uri
        var scopes = req.body.scopes
        var state = req.body.state
        var client_type = req.body.client_type
        var code_challenge = req.body.code_challenge
        var project_id = req.body.project_id
        var code_challenge_method = req.body.code_challenge_method
        var requesting_client = req.headers["user-agent"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var referrer = req.headers.referrer || req.headers.referer
        const oauth_client_check = await OauthClient.findOne({'client_id': client_id})
        if(oauth_client_check == null){
            const error = new Error("Requested Oauth client does not exist")
            error.status = 400
            next(error)
        } else {
            const user = await Users.findOne({
                'email': username
            })
            if(user == null){
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
                    const client_scopes = oauth_client_check["scopes"]
                    if(checkScopes(scopes, client_scopes)){
                        const newOuthAuthorization = new OauthAuthorization({
                            client_id: client_id,
                            redirect_uri: redirect_uri,
                            scopes: scopes,
                            state: state,
                            project_id: project_id,
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
                        const oauth_auth_code = await newOuthAuthorization.save()
                        if(oauth_auth_code["_id"] != undefined){
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
        var code_verifier = req.body.code_verifier;
        var code = req.body.code;
        var username = req.body.username;
        var project_id = req.body.project_id
        var client_type = req.body.client_type
        var user_agent = req.headers["user-agent"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const oauth_client_check = await OauthClient.findOne({
            "client_id": client_id,
            "client_secret": client_secret
        })
        if(oauth_client_check != null){
            const code_docs_check = await OauthAuthorization.findOne({
                'authorization_code': code,
                "client_id": client_id
            })
            if(code_docs_check != null){
                if(code_docs_check["code_challenge_method"] == "plain"){
                    if(code_verifier == code_docs_check["code_challenge"]){
                        var expiry = code_docs_check["expires_in"]
                        const now = new Date()
                        if(now < expiry){
                            const current_scopes = oauth_client_check["scopes"]
                            var now_access = new Date()
                            now_access.setDate(now_access.getDate() + 45)
                            const access_token_expiry = new Date(now_access)
                            const now_refresh = new Date()
                            now_refresh.setDate(now_refresh.getDate() + 120)
                            const refresh_token_expiry = new Date(now_refresh)
                            const access_token = crypto.randomBytes(24).toString('hex')
                            const refresh_token = crypto.randomBytes(24).toString('hex')
                            const new_access_token = new AccessToken({
                                access_token: access_token,
                                expiry: access_token_expiry,
                                client_id: client_id,
                                grant_type: grant_type,
                                grant_value: code,
                                project_id: project_id,
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
                                expiry: refresh_token_expiry,
                                client_id: client_id,
                                grant_type: grant_type,
                                grant_value: code,
                                project_id: project_id,
                                scopes: current_scopes,
                                username: username,
                                client_type: client_type,
                                token_type: "refresh",
                                user_agent: user_agent,
                                user_ip: ip
                            })
                            const refresh_token_document = await new_refresh_token.save()
                            if((access_token_document["_id"] != undefined) && (refresh_token_document["_id"] != undefined)){
                                res.json({
                                    "scopes": current_scopes,
                                    "expiry": access_token_expiry,
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
                    } else {
                        //TODO: Revoke client
                        res.json({
                            "message": "Beta baap ko chutiya mat banao",
                            "status": 403
                        })
                    }
                } else if(code_docs_check["code_challenge_method"] === "S256") {
                    const hash = crypto.createHash("sha256").update(code_verifier).digest("hex")
                    const hash_encoded = Buffer.from(hash).toString("base64")
                    if(hash_encoded == code_docs_check["code_challenge"]){
                        var expiry = code_docs_check["expires_in"]
                        const now = new Date()
                        if(now < expiry){
                            const current_scopes = oauth_client_check["scopes"]
                            var now_access = new Date()
                            now_access.setDate(now_access.getDate() + 45)
                            const access_token_expiry = new Date(now_access)
                            const now_refresh = new Date()
                            now_refresh.setDate(now_refresh.getDate() + 120)
                            const refresh_token_expiry = new Date(now_refresh)
                            const access_token = crypto.randomBytes(24).toString('hex')
                            const refresh_token = crypto.randomBytes(24).toString('hex')
                            const new_access_token = new AccessToken({
                                access_token: access_token,
                                expiry: access_token_expiry,
                                client_id: client_id,
                                grant_type: grant_type,
                                grant_value: code,
                                project_id: project_id,
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
                                expiry: refresh_token_expiry,
                                client_id: client_id,
                                grant_type: grant_type,
                                grant_value: code,
                                project_id: project_id,
                                scopes: current_scopes,
                                username: username,
                                client_type: client_type,
                                token_type: "refresh",
                                user_agent: user_agent,
                                user_ip: ip
                            })
                            const refresh_token_document = await new_refresh_token.save()
                            if((access_token_document["_id"] != undefined) && (refresh_token_document["_id"] != undefined)){
                                res.json({
                                    "scopes": current_scopes,
                                    "expiry": access_token_expiry,
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
                    } else {
                        //TODO: Revoke client
                        res.json({
                            "message": "Beta baap ko chutiya mat banao",
                            "status": 403
                        })
                    }
                }
            }
        } else {
            const error = new Error("Invalid Client Credentials")
            error.status = 401
            next(error)
        }
    },
    refresh: async (req, res, next) => {
        //some prechecks need to be added
        const client_id = req.body.client_id
        const grant_type = "refresh_token"
        const refresh_token = req.body.refresh_token
        const project_id = req.body.project_id
        const username_requested = req.body.username
        const client_type = req.body.client_type
        var user_agent = req.headers["user-agent"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const refresh_token_check = await RefreshToken.findOne({
            "refresh_token": refresh_token
        })
        if(refresh_token_check["_id"] != undefined){
            const generated_access_token = crypto.randomBytes(24).toString('hex')
            const now = new Date()
            now.setDate(now.getDate() + 60)
            const access_token_expiry = new Date(now)
            const new_access_token_query = new AccessToken({
                access_token: generated_access_token,
                expiry: access_token_expiry,
                client_id: client_id,
                grant_type: grant_type,
                project_id: project_id,
                grant_value: refresh_token,
                scopes: refresh_token_check["scopes"],
                username: username_requested,
                client_type: client_type,
                token_type: "bearer",
                user_agent: user_agent,
                user_ip: ip
            })
            const new_access_token = await new_access_token_query.save()
            if(new_access_token["_id"] != undefined){
                res.json({
                    "scopes": refresh_token_check["scopes"],
                    "expiry": access_token_expiry,
                    "token_type": "bearer",
                    "access_token": generated_access_token,
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Invalid Refresh Token Submitted. Forbidden",
                "status": 403
            })
        }
        
    },
    revoke: async (req, res, next) => {
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorization_split = authorization_string.split(':')
        var client_id = authorization_split[0]
        var client_secret = authorization_split[1]
        var project_id = req.body.project_id
        const project_id_check = await OauthClient.findOne({
            "project_id": project_id
        })
        if(project_id_check["client_id"] == client_id && project_id_check["client_secret"] == client_secret){
            const access_token_deletion = await AccessToken.deleteMany({
                "project_id": project_id
            }).exec()
            const refresh_token_deletion = await RefreshToken.deleteMany({
                "project_id": project_id
            }).exec()
            if(access_token_deletion.ok && refresh_token_deletion.ok){
                res.json({
                    "message": "Tokens revoked",
                    "status": 200
                })
            } else {
                res.status(500)
                res.json({
                    "message": "Something seems to be wrong",
                    "status": 500
                })
            }
        } else {
            res.status(401)
            res.json({
                "message": "Invalid Client Credentials. Unauthorized",
                "status": 401
            })
        }
    },
    delete: async (req, res, next) => {
        var authorization_header = req.headers.authorization
        var authorization_string = authorization_header.substring(5, authorization_header.length)
        var authorization_split = authorization_string.split(':')
        var client_id = authorization_split[0]
        var client_secret = authorization_split[1]
        var project_id = req.body.project_id
        const project_id_check = await OauthClient.findOne({
            "project_id": project_id
        })
        if(project_id_check["client_id"] == client_id && project_id_check["client_secret"] == client_secret){
            const access_token_deletion = await AccessToken.deleteMany({
                "project_id": project_id
            }).exec()
            const refresh_token_deletion = await RefreshToken.deleteMany({
                "project_id": project_id
            }).exec()
            if(access_token_deletion.ok && refresh_token_deletion.ok){
                const delete_query = await OauthClient.findOneAndUpdate({
                    "project_id": project_id
                }, {
                    $set: {
                        "isDeleted": true
                    }
                })
                if(delete_query["_id"] != undefined){
                    res.json({
                        "message": `Project ${project_id} Deleted`,
                        "status": 200
                    })
                } else {
                    res.status(500)
                    res.json({
                        "message": "Something seems to be wrong",
                        "status": 500
                    })
                }
            } else {
                res.status(500)
                res.json({
                    "message": "Something seems to be wrong",
                    "status": 500
                })
            }
        } else {
            res.status(401)
            res.json({
                "message": "Invalid Client Credentials. Unauthorized",
                "status": 401
            })
        }
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