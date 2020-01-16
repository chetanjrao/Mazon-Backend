const Passkey = require('../models/passkey.model')
const crypto = require('crypto')

const create_passkey = async (user, grant_method, grant_value, ip, user_agent) => {
    // Generating new passkey
    const passkey = crypto.randomBytes(16).toString("hex")
    const now = new Date()
    now.setMinutes(now.getMinutes() + 15)
    const expiry = new Date(now)
    // Setting up an expiry of 15 minutes from the time of login
    const new_passkey_document = new Passkey({
        user: user,
        passkey: passkey,
        expiry: expiry,
        grant_method: grant_method,
        grant_value: grant_value,
        ip: ip,
        user_agent: user_agent
    })
    const new_passkey = await new_passkey_document.save()
    return new_passkey
}

const validate_passkey = async (passkey, user) => {
    const passkey_document = await Passkey.findOne({
        "user": user,
        "passkey": passkey
    }).sort({ "created_at": -1 })
    if(passkey_document != null){
        const expiry = passkey_document["expiry"]
        const now = new Date()
        if(now < expiry){
            return true
        }
        return false
    }
    return false
}

module.exports = {
    create_passkey,
    validate_passkey
}