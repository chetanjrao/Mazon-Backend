const mongoose = require('mongoose')
const RatingReviews = require('../modals/RatingReview')
const Restaurant = require('../modals/Restaurant')
const {
    check_restaurant
} = require('../services/restaurant.service')

const 

const getRestaurantRatingReviews = async (restaurantID) => {
    const check_restaurant_validity = await check_restaurant(restaurantID)
    var ratingsReviews = []
    if(check_restaurant_validity){
        const ratings_reviews = await RatingReviews.find({
            "reviewDest": restaurantID,
            "isValid": true,
            "isRemoved": false
        })
        ratings_reviews.forEach(async restaurant => {
            ratingsReviews.push({

            })
        });
    } else {
        const error = new Error("Invalid Restaurant ID")
        error.status = 400
        throw error
    }
}


module.exports = {
    getRestaurantRatingReviews,
}