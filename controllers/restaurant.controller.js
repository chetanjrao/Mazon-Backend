/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
//const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')
const Restaurants = require('../models/Restaurant')
const {
    get_inorders_with_restaurant
} = require('../services/inorder.service')
const {
    get_bookings_with_restaurant
} = require('../services/booking.service')
const {
    add_restaurant
} = require('../services/restaurant.service')
const {
    get_aggregation_rating,
    get_destination_rating_review,
    get_final_rating
} = require('../services/ratings.service')

const add_restaurant_controller = async (req, res, next) => {
    const name = req.body["name"]
    const city = req.body["city"]
    const locality = req.body["locality"]
    const state = req.body["state"]
    const pincode = req.body["pincode"]
    const address = req.body["address"]
    const isDeliveryAvailable = req.body["isDeliveryAvailable"]
    const bookingAvailable = req.body["bookingAvailable"]
    const images = req.body["images"]
    const priceForTwo = req.body["priceForTwo"]
    const primary_contact = req.body["primary_contact"]
    const latitude = req.body["latitude"]
    const longitude = req.body["longitude"]
    const alternate_contact = req.body["alternate_contact"]
    const foodType = req.body["foodType"]
    const description = req.body["description"]
    const restaurantEmail = req.body["restaurantEmail"]
    const noOfTables = req.body["noOfTables"]
    const cuisines = req.body["cuisines"]
    const facilities = req.body["facilities"]
    const open_time = req.body["open_time"]
    const close_time = req.body["close_time"]
    const offers = req.body["offers"]
    const user_id = res.locals["user_id"]
    const payment = req.body["payment"]
    const new_restaurant = await add_restaurant(name, city, locality, state, pincode, address, isDeliveryAvailable, bookingAvailable, images, priceForTwo, latitude, longitude, primary_contact, alternate_contact, foodType, restaurantEmail, open_time, close_time, offers, noOfTables, cuisines, description, facilities, user_id, payment)
    if(new_restaurant != null){
        res.status({
            "message": "Restaurant created successfully",
            "status": 200
        })
    } else {
        res.json({
            "message": "Unable to create restaurants",
            "status": 500
        })
    }
}

module.exports = {
    index: async (req, res, next) => {
        const restaurants = await Restaurants.find({})
        res.json(restaurants)
    },
    restaurant: async (req, res, next) => {
        const restaurantID = req.params.restaurantID
        const restaurant = await Restaurants.findOne({'_id': restaurantID})
        const ratings_data = await get_final_rating(restaurantID)
        const ratings_full = await get_destination_rating_review(restaurantID)
        res.json({
            restaurant,
            ratings_data,
            ratings_full
        })
    },
    inorders: async (req, res, next) => {
        const restaurant_id = req.params["restaurantID"]
        const inorders = await get_inorders_with_restaurant(restaurant_id)
        res.json(inorders)
    },
    bookings: async (req, res, next) => {
        const restaurant_id = req.params["restaurantID"]
        const bookings = await get_bookings_with_restaurant(restaurant_id)
        res.json(bookings)
    },
    "add_restaurant": add_restaurant_controller
}