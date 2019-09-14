
const mongoose = require('mongoose')
const Restaurants = require('../modals/Restaurant')

const check_restaurant = async (restaurantID) => {
    const restaurant = await Restaurants.findById(restaurantID)
    return restaurant != undefined && restaurant != {} ? true : false
}

module.exports = {
    check_restaurant
}