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
const  {
    sendNotificationToDevice
} = require('../helpers/firebase.helper')
const {
    inorder_payload
} = require('./payload.service')

const create_inorder_token = async (restaurant_id, table_no, offer_code="", user, ip, created_by) => {
    var token = generate_unique_identifier(24)
    var token_document  = await InorderToken.findOne({
        "token": token
    })
    while(token_document != null){
        token = generate_unique_identifier(24)
        token_document  = await InorderToken.findOne({
            "token": token
        })
    }
    const now = new Date()
    now.setHours(now.getHours() + 12)
    const expiry = new Date(now)
    const new_token_document = new InorderToken({
        user: user,
        token: token,
        expiry: expiry,
        restaurant_id: restaurant_id,
        table_no: table_no,
        ip: ip,
        offer_code: offer_code,
        created_by: created_by
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

const get_order_using_token = async (order_token, strict) => {
    if(strict){
        const inorder_document = await Inorder.find({
            "order_token": order_token,
            "order_status": 3,
            "is_paid": false
        })
        return inorder_document
    } else {
        const inorder_document = await Inorder.find({
            $or: [
                {
                    "order_token": order_token,
                    "order_status": 2,
                    "is_paid": false
                },
                {
                    "order_token": order_token,
                    "order_status": 3,
                    "is_paid": false
                },
            ]
        })
        return inorder_document
    }
}

const get_order_using_token_partner = async (order_token, reference) => {
        const inorder_document = await Inorder.find({
            "_id": reference,
            "order_token": order_token,
            "is_paid": false
        })
        return inorder_document
}

const get_inorders_specific = async (restaurant_id, status) => {
    const inorders = await Inorder.find({
        "rId": restaurant_id,
        "order_status": status
    })
    return inorders
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

const get_all_earnings_of_restaurant = async (restaurant_id,) => {
    const inorders = await Inorder.aggregate([
        {
            $match: {
                "rId": restaurant_id,
            }
        },
        {
            $group: {
                "_id": {
                    "rId": restaurant_id
                },
                "total": {
                    "$sum": "$amount"
                },
                "inorders": {
                    "$sum": 1
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "total": "$total",
                "inorders": "$inorders"
            }
        }
    ])
    return inorders
}

const get_current_days_inorders_of_restaurant = async (restaurant_id, date) => {
    const inorders = await Inorder.aggregate([
        {
            $match: {
                "rId": restaurant_id,
                "order_date_time": {
                    "$gte": new Date(date.getYear() + 1900, date.getMonth(), date.getDate()),
                    "$lt": new Date(date.getYear() + 1900, date.getMonth(), date.getDate()+1)
                } 
            }
        },
        {
            $group: {
                "_id": {
                    "day": {
                        $dayOfMonth: "$order_date_time"
                    },
                    "year": {
                            $year: "$order_date_time"
                        },
                    "month": {
                            $month: "$order_date_time"
                        }
                },
                "total": {
                    "$sum": "$amount"
                },
                "inorders": {
                    "$sum": 1
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "total": "$total",
                "inorders": "$inorders"
            }
        }
    ])
    return inorders
}

const place_inorder = async (user, device_id, restaurant_id, table_no, menu, order_token, offer_applied, name, phone, email, created_by, is_waiter_taken) => {
    var order_status = 1;
    if(is_waiter_taken == true){
        order_status = 2
    }
    const inorder_query = new Inorder({
        user: user,
        rId: restaurant_id,
        rTable: table_no,
        device_id: device_id,
        menu: menu,
        order_date_time: new Date(),
        order_status: order_status,
        order_token: order_token,
        offer_applied: offer_applied,
        name: name,
        phone: phone,
        email: email,
        created_by: created_by
    })
    const new_inorder = await inorder_query.save()
    for(var i=0; i < menu.length; i++){
        await update_inorder_content(restaurant_id, new_inorder["_id"], menu[i].cId, menu[i].fId)
    }
    sendNotificationToDevice("123", inorder_payload("Chethan", "Test", 123))
    return new_inorder
}

const show_inorder = async (order_id) => {
    const inorder = await Inorder.findOne({
        "_id": order_id
    }, {})
    return inorder
}

const get_inorders_with_email = async (email) => {
    const inorders = await Inorder.find({
        "email": email
    })
    return inorders
}

const get_active_inorder_with_email = async (email) => {
    const inorders = await Inorder.findOne({
        "email": email,
        "is_paid": false
    })
    return inorders
}

const get_inorders_with_restaurant = async (restaurant) => {
    const inorders = await Inorder.find({
        "rId": restaurant
    })
    return inorders
}

const get_token_details = async (token, user) => {
    const token_document = await InorderToken.findOne({
        "token": token,
        "user": user
    })
    return token_document
}

const finish_inorder = async (order_id, amount) => {
    const inorder = await show_inorder(order_id)
    const updated_inorder = await inorder.update({
        $set: {
            "order_status": 4,
            "is_paid": true,
            "amount": amount
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

const get_overall_details = async (restaurant_id, items) => {
    var amount = 0
    var response = []
    for(var i=0; i<items.length;i++){
        var details = {
            "name": "",
            "price": "",
            "quantity": "",
            "food_id": ""
        }
        var food = await get_particular_food_details(restaurant_id, items[i]["cId"], items[i]["fId"])
        details["name"] = food["fName"]
        details["food_id"] = food["_id"]
        var price = items[i]["isHalf"] && food["halfPrice"] != undefined ? food["halfPrice"] : food["price"]
        details["price"] = price
        var food_amount = Number.parseFloat(price) * Number.parseFloat(items[i]['quantity'])
        details["quantity"] = items[i]['quantity']
        amount += Number.parseFloat(food_amount)
        response.push(details)
    }
    return response
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
    validate_inorder_token,
    get_inorders_with_email,
    get_inorders_with_restaurant,
    get_active_inorder_with_email,
    get_order_using_token,
    get_overall_details,
    get_token_details,
    get_order_using_token_partner,
    get_current_days_inorders_of_restaurant,
    get_all_earnings_of_restaurant,
    get_inorders_specific
}