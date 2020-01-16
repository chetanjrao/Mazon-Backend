/*
 * Created on Thu Sep 19 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const MenuSchema = new mongoose.Schema({
    dish_id: {
        type: String,
        required: true
    },
    rId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isFeatured: {
        type: Boolean,
        required: true,
        default: false
    },
    inorders: {
        type: [String],
        default: []
    },
    images: {
        type: [String]
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true,
        select: false
    },
    created_by: {
        type: String,
        required: true,
        select: false
    },
    updated_by: {
        type: String,
        select: false
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        select: false
    }
})

const MenuCollection = resources.model('Menu', MenuSchema)
module.exports = MenuCollection