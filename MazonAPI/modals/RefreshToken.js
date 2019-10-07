/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')

const RefreshToken = new mongoose.Schema({
    refresh_token: {
        type: String,
        required: true
    },  
    expiry: {
        type: Date,
        required: true
    },
    project_id: {
        type: String,
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
    }
})

const RefreshTokenModel = mongoose.model('RefreshToken', RefreshToken)

module.exports = RefreshTokenModel