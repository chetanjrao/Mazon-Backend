/*
 * Created on Sun Sep 15 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')
const {
    getRestaurantMenu
} = require('../services/menu.service')

module.exports = {
    getRestaurantMenu: async (req, res, next) => {
        const restaurant_id = req.params["restaurantID"]
        const restaurantMenu = await getRestaurantMenu(restaurant_id)
        res.json(restaurantMenu)
    },
    getFoodDetails: async (req, res, next) => {
        
    }
}

