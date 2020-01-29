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
const Settlements = require('../models/settlements.model')
const {
    debit_points_to_wallet,
    credit_points_to_wallet,
    get_wallet_based_user
} = require('../services/wallet.service')
const {
    create_transaction
} = require('../services/transaction.service')

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
        const apetite = req.body["apetite"]
        const is_using_wallet = req.body["is_using_wallet"]
        const satisfaction = req.body["satisfaction"]
        const references = req.body["references"]
        const amount = req.body["amount"]
        const payment_mode = req.body["payment_mode"]
        const order_token = req.headers["x-mazon-token"]
        const payment_id = req.body["payment_id"]
        const restaurant_id = req.body["restaurant_id"]
        const order_id = req.body["order_id"]
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var user_agent = req.headers["user-agent"]
        if(payment_mode != "CASH"){
            const new_settlement_document = new Settlements({
                order_id: order_id,
                payment_id: payment_id,
                inorder_token: order_token,
                user_id: user,
                restaurant_id: restaurant_id
            })
            const new_settlement = await new_settlement_document.save()
            
        }

        const wallet = await get_wallet_based_user(user)
        if(is_using_wallet){
            const waleet_points = req.body["wallet_points"]
            const transaction_doc = await create_transaction(wallet["_id"], `Inorder ID's debit`, waleet_points, 2, ip, "Mazon Technologies Pvt. Ltd." ,user, user_agent)
            await debit_points_to_wallet(user, transaction_doc["reference"], waleet_points)
        }
        switch(type){
            case 2:
                for(var i=0;i<reviews.length;i++){
                    post_rating_review(reviews[i]["food_id"], restaurant_id, reviews[i]["rating"], reviews[i]["reference"], reviews[i]["review"], user, apetite, satisfaction, email)
                }
                const transaction_doc = await create_transaction(wallet["_id"], `Credit for rating food`, 5*reviews.length, 1, ip, "Mazon Technologies Pvt. Ltd.", user, user_agent)
                await credit_points_to_wallet(user, 5*reviews.length)
                for(var j=0;j<references.length;j++){
                    await finish_inorder(references[j], amount, payment_mode)
                }
                break;
        }
        res.send("ok")
    },
    get_overall_rating: async (req, res,next) => {
        const refID = req.params["refID"]
        const refType = req.params["refType"]

    }
}