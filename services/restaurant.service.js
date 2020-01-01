/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const Restaurants = require('../models/Restaurant')
const Cuisines = require('../models/Cuisine')
const Menu = require('../models/Menu')
const FoodTypes = require('../models/FoodType')
const Ingredients = require('../models/Ingredient')

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

const utilities = async (restaurant_id) => {
    const cuisines = await Cuisines.find({}, {"created_at": 0, "created_by": 0})
    const foodTypes = await FoodTypes.find({})
    const ingredients = await Ingredients.find({})
    const menu = await Menu.findOne({
        "rId": restaurant_id
    })
    const final_catgories = []
    for(var i=0;i<menu["menu"].length;i++){
        final_catgories.push({
            "category": menu["menu"][i]["category"],
            "index": i
        })
    }
    return {
        "cusines": cuisines,
        "categories": final_catgories,
        "foodTypes": foodTypes,
        "ingredients": ingredients
    }
}

const add_restaurant = async (name, city, locality, state, pincode, address, isDeliveryAvailable, bookingAvailable, images, priceForTwo, latitude, longitude, primary_contact, alternate_contact='', foodType, restaurantEmail, open_time, close_time, offers, noOfTables, cuisines, description, facilities, created_by, payment) => {
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
        created_by: created_by,
        payment: payment
    })
    const new_restaurant = await restaurant_document.save()
    return new_restaurant
}

module.exports = {
    check_restaurant,
    get_restaurant_owner_details,
    get_restaurant,
    add_restaurant,
    utilities
}