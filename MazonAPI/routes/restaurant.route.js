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
//const router = require('express-promise-router')();

router.route('/').get(restaurantController.index)

router.route('/:restaurantID').get(restaurantController.restaurant)

router.route('/:restaurantID/ratings').get(ratings_controller.restaurant_ratings)

router.route('/:restaurantID/menu').get(menu_controller.getRestaurantMenu)

module.exports = router