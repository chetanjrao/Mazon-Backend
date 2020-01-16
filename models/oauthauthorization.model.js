const mongoose = require('mongoose')
const {
    resources
} = require("../helpers/db.helper")

const OauthAuthorizationSchema = new mongoose.Schema({
    client_id: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    redirect_uri: {
        type: String,
        reuired: true
    },
    scopes: {
        type: [String],
        required:true
    },
    state: {
        type: String,
        required: true
    },
    code_challenge: {
        type: String,
    },
    client_type: {
        type: Number,
        required: true
    },
    code_challenge_method: {
        type: String
    },
    referrer: {
        type: String
    },
    authorization_code: {
        type: String,
        required: true
    },
    expires_in: {
        type: Date,
        required: true,
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
    }
})

const OauthAuthorization = resources.model('OauthAuthorization', OauthAuthorizationSchema)

module.exports = OauthAuthorization