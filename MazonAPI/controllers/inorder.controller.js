/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const {
    resources
} = require('../helpers/dbHelper')
const {
    calculate_amount
} = require('../services/inorder.service')

const calculate_menu_amount = async (req, res, next) => {
    const restaurant_id = req.params["restaurant_id"]
    const menu = req.params["menu"]
    const amount = await calculate_amount(restaurant_id, menu)
    res.send(amount)
}

module.exports = {
    calculate_menu_amount
}