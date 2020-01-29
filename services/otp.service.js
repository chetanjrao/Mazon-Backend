const OTP = require('../models/otp.model')

const create_otp = async (otp, grant_value, scope) => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 15)
    const expiry = new Date(now)
    const new_otp_document = new OTP({
        otp: otp,
        grant_value: grant_value,
        expiry: expiry,
        scope: scope
    })
    const otp_document = await new_otp_document.save()
    return otp_document
}

const validate_otp = async (grant_value, otp, scope) => {
    const now = new Date()
    const otp_document = await OTP.findOne({
        "otp": otp,
        "grant_value": grant_value,
        "scope": scope,
        "is_valid": true
    }).sort({ "created_at": -1 })
    if(otp_document != null){
        if(now < otp_document["expiry"]){
            return true
        }
        return false
    }
    return false
}

const invalidate_otp = async (grant_value, otp, scope) => {
    const otp_document = await OTP.findOne({
        "otp": otp,
        "grant_value": grant_value,
        "scope": scope,
        "is_valid": true
    }).sort({ "created_at": -1 })
    const updated_document = await otp_document.updateOne({
        $set: {
            is_valid: false
        }
    })
    return updated_document
}

module.exports = {
    create_otp,
    validate_otp,
    invalidate_otp
}