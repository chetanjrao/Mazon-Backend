/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    getRestaurantRatingReviews
} = require('../services/ratings.service')

module.exports = {
    restaurant_ratings: async (req, res, next) => {
        const restaurantID = req.params["restaurantID"]
        const ratings = await getRestaurantRatingReviews(restaurantID)
        res.json(ratings)
    },
    food_ratings: async (req, res, next) => {
        
    },
    post_rating: async (req, res, next) => {
        
    },
    get_overall_rating: async (req, res,next) => {
        const refID = req.params["refID"]
        const refType = req.params["refType"]

    }
}