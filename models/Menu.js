/*
 * Created on Thu Sep 19 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')

const MenuSchema = new mongoose.Schema({
    rId: {
        type: String,
        required: true
    },
    menu: [{
        category: {
            type: String,
            required: true
        },
        items: [{
            fName: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            category: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            halfPrice: {
                type: Number
            },
            ingredients: {
                type: [String],
            },
            fType: {
                type: [String]
            },
            cuisines: {
                type: [String]
            },
            isVeg: {
                type: Boolean,
                required: true,
                default: true
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
                required: true
            },
            created_by: {
                type: String,
                required: true
            },
            updated_by: {
                type: String
            },
            updated_at: {
                type: Date,
                default: Date.now()
            },
        }]
    }]
})

const MenuCollection = resources.model('Menu', MenuSchema)
module.exports = MenuCollection