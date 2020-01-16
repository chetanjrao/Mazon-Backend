const AccessToken = require('../models/accesstoken.model')
const crypto = require('crypto')

const create_accesstoken = async (client_id, grant_type, grant_value, scopes, project_id, user, client_type, token_type, user_agent, ip) => {
    const access_token = crypto.randomBytes(24).toString('hex')
    const now = new Date()
    now.setDate(now.getDate() + 60)
    const expiry = new Date(now)
    const new_access_token_document = new AccessToken({
        access_token: access_token,
        expiry: expiry,
        client_id: client_id,
        grant_type: grant_type,
        grant_value: grant_value,
        scopes: scopes,
        project_id: project_id,
        user: user,
        client_type: client_type,
        token_type: token_type,
        user_agent: user_agent,
        ip: ip
    })
    const new_access_token = await new_access_token_document.save()
    return new_access_token
}

const validate_accesstoken = async (access_token, user) => {
    const access_token = await AccessToken.findOne({
        "access_token": access_token,
        "user": user,
        "is_revoked.is_revoked": false
    }).sort({ "created_at": -1 })
    if(access_token == null){
        const now = new Date()
        if(now < access_token["expiry"]){
            return true
        }
        return false
    }
    return false
}

const revoke_accesstokens = async (user, revoked_by) => {
    const access_tokens = await AccessToken.updateMany({
        "user": user,
        "is_revoked.is_revoked": false
    }, {
        $set: {
            "is_revoked.is_revoked": true,
            "is_revoked.revoked_by": revoked_by,
            "is_revoked.revoked_at": new Date()
        }
    })
    return access_tokens
}

const get_accesstoken = async (user) => {
    const access_token = await AccessToken.findOne({
        "user": user,
        "is_revoked.is_revoked": false
    })
    return access_token
}

module.exports = {
    create_accesstoken,
    validate_accesstoken,
    revoke_accesstokens,
    get_accesstoken
}