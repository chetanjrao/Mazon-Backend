/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')

const OauthSchema = new mongoose.Schema({
    client_id: {
        type: String,
        required: true
    },
    package_identifier: {
        type: String
    },
    client_type: {
        type: Number,
        required: true,
        default: 1 // 1) Mobile Application, 2) Web Application
    },
    client_secret: {
        type: String,
        required: true
    },
    authorization_url: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    project_id: {
        type: String
    },
    time_of_creation: {
        type: Date,
        required: true,
        default: new Date()
    },
    scopes: {
        type: [String],
        required: true,
        default: [
            'read_public_data',
            'report_public_data',
            'read_ratings',
        ]
    },
    home_page_url: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    developer_name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
})

const OauthClient = mongoose.model('OauthClient', OauthSchema)

module.exports = OauthClient