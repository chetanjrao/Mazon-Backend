/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant.controller')
const ratings_controller = require('../controllers/rating.controller')
const menu_controller = require('../controllers/menu.controller')
const offer_controller = require('../controllers/offer.controller')
const inorder_controller = require('../controllers/inorder.controller')
const {
    token_middleware
} = require('../controllers/user.controller')
router.route('/').get(restaurantController.index)

router.route('/:restaurantID').get(restaurantController.restaurant)

router.route('/:restaurantID/ratings').get(ratings_controller.restaurant_ratings)

router.route('/:restaurantID/menu').get(menu_controller.getRestaurantMenu)

router.route('/:restaurantID/inorders').get(restaurantController.inorders)

router.route('/:restaurantID/bookings').get(restaurantController.bookings)

router.route('/:restaurantID/featuring').get(menu_controller.getFeaturedFood)

router.route('/:restaurantID/analytics').get(inorder_controller.get_weekly_analytics)

router.route('/:restaurantID/offers/check').get(offer_controller.check_offer_controller)

router.use(token_middleware).route('/:restaurantID/ratings/create').post(ratings_controller.post_rating);


module.exports = router