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
    return restaurant
}

const get_restaurant = async (restaurantID) => {
    const restaurant = await Restaurants.findOne({ "_id": restaurantID})
    return restaurant
}

const get_restaurant_owner_details = async (restaurant_id) => {
    const restaurant = await Restaurants.findOne({ "_id": restaurant_id})
    return restaurant
}

const add_restaurant = async (name, city, locality, state, pincode, address, isDeliveryAvailable, bookingAvailable, images, priceForTwo, latitude, longitude, primary_contact, alternate_contact='', foodType, restaurantEmail, open_time, close_time, offers, noOfTables, cuisines, description, facilities, created_by) => {
    const restaurant_document = new Restaurants({
        name: name,
        city: city,
        locality: locality,
        state: state,
        pincode: pincode,
        address: address,
        isDeliveryAvailable: isDeliveryAvailable,
        bookingAvailable: bookingAvailable,
        images: images, 
        priceForTwo: priceForTwo,
        coordinates: {
            latitude: latitude,
            longitude: longitude
        },
        primary_contact: primary_contact,
        alternate_contact: alternate_contact,
        foodType: foodType,
        description: description,
        restaurantEmail: restaurantEmail,
        noOfTables: noOfTables,
        cuisines: cuisines,
        facilities: facilities,
        timing: {
            openTime: open_time,
            closeTime: close_time
        },
        offers: offers,
        created_by: created_by
    })
    const new_restaurant = await restaurant_document.save()
    return new_restaurant
}

module.exports = {
    check_restaurant,
    get_restaurant_owner_details,
    get_restaurant,
    add_restaurant
}