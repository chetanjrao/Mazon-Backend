/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const Restaurants = require('../modals/Restaurant')

const check_restaurant = async (restaurantID) => {
    const restaurant = await Restaurants.find({ "_id": restaurantID})
    return restaurant != undefined && restaurant != {} ? true : false
}

module.exports = {
    check_restaurant
}