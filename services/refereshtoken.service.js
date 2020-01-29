const RefreshToken = require('../models/refreshtoken.model')
const crypto = require('crypto')

const create_refreshtoken = async (user, user_agent, ip) => {
    const refresh_token = crypto.randomBytes(24).toString('hex')
    const now = new Date()
    now.setDate(now.getDate() + 60)
    const expiry = new Date(now)
    const new_refresh_token_document = new RefreshToken({
        refresh_token: refresh_token,
        expiry: expiry,
        user: user,
        client_type: "app",
        token_type: "bearer",
        user_agent: user_agent,
        ip: ip
    })
    const new_refresh_token = await new_refresh_token_document.save()
    return new_refresh_token
}

const validate_refreshtoken = async (refresh_token, user) => {
    const refresh_token_document = await RefreshToken.findOne({
        "refresh_token": refresh_token,
        "user": user,
        "is_revoked.is_revoked": false
    }).sort({ "created_at": -1 })
    if(refresh_token_document != null){
        const now = new Date()
        if(now < refresh_token_document["expiry"]){
            return true
        }
        return false
    }
    return false
}

const revoke_refreshtokens = async (user, revoked_by) => {
    const refresh_tokens = await RefreshToken.updateMany({
        "user": user
    }, {
        $set: {
            "is_revoked.is_revoked": true,
            "is_revoked.revoked_by": revoked_by,
            "is_revoked.revoked_at": new Date()
        }
    })
    return refresh_tokens
}

module.exports = {
    create_refreshtoken,
    validate_refreshtoken,
    revoke_refreshtokens
}