const mongoose = require('mongoose')
const Inorder = require('../models/Inorder')
const {
    getFoodDetails,
    get_particular_food_details,
    update_inorder_content
} = require('./menu.service')
const {
    get_restaurant_owner_details
} = require('./restaurant.service')
const InorderToken = require("../models/InorderToken")
const {
    generate_unique_identifier
} = require("./utils.service")

const create_inorder_token = async (restaurant_id, table_no, user, ip) => {
    const token = generate_unique_identifier(24)
    const now = new Date()
    now.setHours(now.getHours() + 8)
    const expiry = new Date(now)
    const new_token_document = new InorderToken({
        user: user,
        token: token,
        expiry: expiry,
        restaurant_id: restaurant_id,
        table_no: table_no,
        ip: ip
    })
    const new_token = await new_token_document.save()
    return new_token
}

const get_inorder_token = async (token, user, restuarant_id) => {
    return await InorderToken.findOne({
        "token": token,
        "user": user,
        "restaurant_id": restuarant_id
    })
}

const validate_inorder_token = async (token, user, restuarant_id) => {
    const user_token = await get_inorder_token(token, user, restuarant_id)
    if(user_token["_id"] != undefined){
        const now = new Date()
        const expiry = user_token["expiry"]
        if(now < expiry){
            return true
        }
    }
    return false
}

const place_inorder = async (restaurant_id, table_no, menu, order_token, offer_applied, name, phone, email) => {
    const inorder_query = new Inorder({
        rId: restaurant_id,
        rTable: table_no,
        menu: menu,
        order_date_time: new Date(),
        order_status: 1,
        order_token: order_token,
        offer_applied: offer_applied,
        name: name,
        phone: phone,
        email: email
    })
    const new_inorder = await inorder_query.save()
    for(var i=0; i < menu.length; i++){
        await update_inorder_content(restaurant_id, new_inorder["_id"], menu[i].cId, menu[i].fId)
    }
    return new_inorder
}

const show_inorder = async (order_id) => {
    const inorder = await Inorder.findOne({
        "_id": order_id
    }, {})
    return inorder
}

const finish_inorder = async (order_id) => {
    const inorder = await show_inorder(order_id)
    const updated_inorder = await inorder.update({
        $set: {
            "order_status": 5
        }
    })
    return updated_inorder
}

const add_payment = async (order_id, payment_mode, amount) => {
    
}

const update_inorder = async (order_id, update_status, updated_by) => {
    const inorder = await show_inorder(order_id)
    const updated_order = await inorder.update({
        $set: {
            "order_status": update_status,
            "last_updated_by": updated_by
        }
    })
    return updated_order
}

const get_final_price = async (order_id) => {
    const inorder = await show_inorder(order_id)
    const calculated_amount = await calculate_amount(inorder["r_id"], inorder["items"])
}

const calculate_amount = async (restaurant_id, items) => {
    var amount = 0
    for(var i=0; i<items.length;i++){
        var food = await get_particular_food_details(restaurant_id, items[i]["cId"], items[i]["fId"])
        var price = items[i]["isHalf"] && food["halfPrice"] != undefined ? food["halfPrice"] : food["price"]
        var food_amount = Number.parseFloat(price) * Number.parseFloat(items[i]['quantity'])
        amount += Number.parseFloat(food_amount)
    }
    return amount
}

module.exports = {
    calculate_amount,
    place_inorder,
    add_payment,
    show_inorder,
    finish_inorder,
    update_inorder,
    get_final_price,
    create_inorder_token,
    validate_inorder_token
}