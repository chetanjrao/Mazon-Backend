/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */


const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/RestaurantController')
//const router = require('express-promise-router')();

router.route('/').get(restaurantController.index)

router.route('/:restaurantID').get(restaurantController.restaurant)

module.exports = router