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
            var Dishes = []
            ratingFinal = 0
            reviewCount = 0
            restaurantData.push({
                id: element.id,
                name: element.name,
                address: element.address,
                menu: element.menu.forEach(function(dish){
                    var foodRatingsReviews = []
                    Dishes.push({
                        fId: dish.fId,
                        fName: dish.fName,
                        fPrice: dish.fPrice,
                        fRatingReviews: dish.fRatingReviews.forEach(fRatingReview => {
                            if(fRatingReview.isValid){
                                foodRatingsReviews.push({
                                    rId: fRatingReview.rId,
                                    rUser: fRatingReview.rUser,
                                    rRating: fRatingReview.rRating,
                                    rTime: fRatingReview.rTime,
                                })
                            }
                        }),
                        foodRatingReviews: foodRatingsReviews
                    })
                }),
                dishes: Dishes,
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
                ratings: element.ratingReviews.forEach(rating => {
                    if(rating.isValid){
                        ratingFinal += rating["rating"]
                        reviewCount += 1
                    }
                }),
                ratings: ratingFinal/reviewCount,
                reviews: element.ratingReviews,
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
            var Dishes = []
            ratingFinal = 0
            reviewCount = 0
            restaurantData.push({
                id: element.id,
                name: element.name,
                address: element.address,
                dishes: Dishes,
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
                ratings: "5",
                ratings: ratingFinal/reviewCount,
                reviews: element.ratingReviews,
                cuisines: element.cuisines,
                facilities: element.facilities,
                foodType: element.foodType
            })
        })
        res.json(restaurantData[0])
    }
}