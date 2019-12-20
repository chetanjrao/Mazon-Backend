/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    getRestaurantRatingReviews,
    post_rating_review
} = require('../services/ratings.service')
const {
    finish_inorder
} = require('../services/inorder.service')

module.exports = {
    restaurant_ratings: async (req, res, next) => {
        const restaurantID = req.params["restaurantID"]
        const ratings = await getRestaurantRatingReviews(restaurantID)
        res.json(ratings)
    },
    food_ratings: async (req, res, next) => {
        
    },
    post_rating: async (req, res, next) => {
        const reviews = req.body["reviews"]
        const user = res.locals["user_id"]
        const email = req.body["email"]
        const type = req.body["type"]
        const references = req.body["references"]
        switch(type){
            case 2:
                for(var i=0;i<reviews.length;i++){
                    post_rating_review(reviews[i]["food_id"], type, reviews[i]["rating"], reviews[i]["reference"], reviews[i]["review"], user, reviews[i]["apetite"], reviews[i]["satisfaction"], email)
                }
                for(var j=0;j<references.length;j++){
                    await finish_inorder(references[j])
                }
                break;
        }
        res.json({
            "message": "Reviews posted successfully",
            "status": 200
        })
    },
    get_overall_rating: async (req, res,next) => {
        const refID = req.params["refID"]
        const refType = req.params["refType"]

    }
}