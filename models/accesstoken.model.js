const mongoose = require('mongoose')
const {
    resources
} = require("../helpers/db.helper")

const AccessToken = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    is_revoked: {
        is_revoked: {
            type: Boolean,
            default: false
        },
        revoked_by: {
            type: String
        },
        revoked_at: {
            type: Date
        }
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const AccessTokenModel = resources.model('AccessToken', AccessToken)

module.exports = AccessTokenModel