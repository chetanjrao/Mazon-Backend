/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const Restaurants = require('../models/Restaurant')

const check_restaurant = async (restaurantID) => {
    const restaurant = await Restaurants.findOne({ "_id": restaurantID})
    return restaurant != undefined && restaurant != {}
}

const get_restaurant_owner_details = async (restaurant_id) => {
    const restaurant = await Restaurants.findOne({ "_id": restaurant_id})
    return restaurant
}

module.exports = {
    check_restaurant,
    get_restaurant_owner_details
}