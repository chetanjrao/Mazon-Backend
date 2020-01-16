/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    resources
} = require("../helpers/db.helper")

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
    created_at: {
        type: Date,
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
    is_deleted: {
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_by: {
            type: String
        },
        deleted_at: {
            type: Date
        }
    },
    is_disabled: {
        is_disabled: {
            type: Boolean,
            default: false
        },
        disabled_by: {
            type: String
        },
        disabled_at: {
            type: Date
        }
    }
})

const OauthClient = resources.model('OauthClient', OauthSchema)

module.exports = OauthClient