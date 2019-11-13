/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
//const mongoose = require('mongoose')
const database = require('../helpers/dbHelper')
const Restaurants = require('../modals/Restaurant')

module.exports = {
    index: async (req, res, next) => {
        var restaurantData = []
        const restaurants = await Restaurants.find({})
        restaurants.forEach(element => {
            restaurantData.push({
                id: element.id,
                name: element.name,
                address: element.address,
                images: element.images, 
                priceForTwo: element.priceForTwo,
                combos: element.combos,
                coordinates: element.coordinates,
                phNo: element.phNo,
                telNo: element.telNo,
                restaurantEmail: element.restaurantEmail,
                timings: element.timing,
                offers: element.offers,
                noOfTables: element.noOfTables,
                description: element.description,
                cuisines: element.cuisines,
                facilities: element.facilities,
                foodType: element.foodType
            })
        })
        res.json(restaurantData)
    },
    restaurant: async (req, res, next) => {
        var restaurantData = []
        const restaurantID = req.params.restaurantID
        const restaurants = await Restaurants.find({'_id': restaurantID})
        restaurants.forEach(element => {
            restaurantData.push({
                id: element.id,
                name: element.name,
                address: element.address,
                images: element.images, 
                priceForTwo: element.priceForTwo,
                combos: element.combos,
                coordinates: element.coordinates,
                phNo: element.phNo,
                telNo: element.telNo,
                restaurantEmail: element.restaurantEmail,
                timings: element.timing,
                offers: element.offers,
                noOfTables: element.noOfTables,
                description: element.description,
                cuisines: element.cuisines,
                facilities: element.facilities,
                foodType: element.foodType
            })
        })
        res.json(restaurantData[0])
    }
}