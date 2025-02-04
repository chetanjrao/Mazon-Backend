const mongoose = require('mongoose')
const {
    resources
} = require("../helpers/dbHelper")

const AccessToken = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    grant_type: {
        type: String,
        required: true
    },
    grant_value: {
        type: String,
        required: true
    },
    scopes: {
        type: [String],
        required: true,
        default: []
    },
    project_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    client_type:{
        type: Number,
        required: true
    },
    token_type: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    user_ip: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const AccessTokenModel = resources.model('AccessToken', AccessToken)

module.exports = AccessTokenModel