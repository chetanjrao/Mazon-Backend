const mongoose = require('mongoose')
const Inorder = require('../modals/Inorder')
const {
    getFoodDetails,
    get_particular_food_details
} = require('./menu.service')
INORDER_EXCLUDED_PROJECTIONS = {"order_token": 0,  }

const place_inorder = async (restaurant_id, table_no, menu, order_reference, order_token, offer_applied) => {

}

const show_inorder = async (order_reference) => {
    const inorder = await Inorder.findOne({
        "order_reference": order_reference
    }, {})
    return inorder
}

const finish_inorder = async (order_id) => {

}

const edit_inorder = async (order_id, items) => {

}

const add_payment = async (order_id, payment_mode, amount) => {

}

const calculate_amount = async (restaurant_id, items) => {
    var amount = 0
    for(var i=0; i<items.length;i++){
        var food = await get_particular_food_details(restaurant_id, items[i]["_id"])
        var price = food["price"]
        var food_amount = Number.parseFloat(price) * Number.parseFloat(items[i]*quantity)
        amount += Number.parseFloat(food_amount)
    }
    return amount
}

module.exports = {
    calculate_amount,
    place_inorder,
    edit_inorder,
    add_payment,
    show_inorder,
    finish_inorder
}