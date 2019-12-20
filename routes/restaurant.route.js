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

router.route('/').get(restaurantController.index)

router.route('/:restaurantID').get(restaurantController.restaurant)

router.route('/:restaurantID/ratings').get(ratings_controller.restaurant_ratings)

router.route('/:restaurantID/menu').get(menu_controller.getRestaurantMenu)

router.route('/:restaurantID/inorders').get(restaurantController.inorders)

router.route('/:restaurantID/bookings').get(restaurantController.bookings)

module.exports = router