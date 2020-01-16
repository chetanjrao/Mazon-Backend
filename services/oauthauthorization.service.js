const OauthAuthorization = require('../models/oauthauthorization.model')
const crypto = require('crypto')

const create_oauthauthorization = async (client_id, redirect_uri, scopes, state, project_id, client_type, code_challenge, code_challenge_method, referrer, authorization_code, expiry, user, user_agent, ip ) => {
    // Generating new oauthauthorization
    const authorization_code = crypto.randomBytes(16).toString("hex")
    const now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    const expiry = new Date(now)
    // Setting up an expiry of 15 minutes from the time of login
    const new_oauthauthorization_document = new OauthAuthorization({
        client_id: client_id,
        redirect_uri: redirect_uri,
        scopes: scopes,
        state: state,
        project_id: project_id,
        client_type: client_type,
        code_challenge: code_challenge,
        code_challenge_method: code_challenge_method,
        referrer: referrer,
        authorization_code: authorization_code,
        expires_in: expiry,
        user: user,
        user_agent: user_agent,
        ip: ip
    })
    const new_oauthauthorization = await new_oauthauthorization_document.save()
    return new_oauthauthorization
}

const validate_oauthauthorization = async (oauthauthorization, user) => {
    const oauthauthorization_document = await OauthAuthorization.findOne({
        "user": user,
        "oauthauthorization": oauthauthorization
    }).sort({ "created_at": -1 })
    if(oauthauthorization_document != null){
        const expiry = oauthauthorization_document["expiry"]
        const now = new Date()
        if(now < expiry){
            return true
        }
        return false
    }
    return false
}

module.exports = {
    create_oauthauthorization,
    validate_oauthauthorization
}