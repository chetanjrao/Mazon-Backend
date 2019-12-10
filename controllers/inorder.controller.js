/*
 * Created on Sat Sep 14 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const {
    calculate_amount,
    place_inorder,
    finish_inorder,
    show_inorder,
    update_inorder,
    create_inorder_token,
    validate_inorder_token,
    get_active_inorder_with_email,
    get_inorders_with_restaurant,
    get_order_using_token,
    get_overall_details,
    get_token_details
} = require('../services/inorder.service')
const {
    
} = require("../services/utils.service")
const {
    get_user_details,
    get_user_details_by_email
} = require("../services/user.service")
const {
    add_analytics
} = require("../services/analytics.service")
const {
    get_restaurant
} = require('../services/restaurant.service')

const calculate_menu_amount = async (req, res, next) => {
    const restaurant_id = req.params["restaurant_id"]
    const menu = req.params["menu"]
    const amount = await calculate_amount(restaurant_id, menu)
    res.send(amount)
}

const place_inorder_controller = async (req, res, next) => {
    const restaurant_id = req.body["restaurant_id"]
    const table_no = req.body["table_no"]
    const menu = req.body["menu"]
    const order_token = res.locals["inorder-token"]
    const offer_applied = req.body["offer_applied"]
    const name = req.body["name"]
    const phone = req.body["phone"]
    const email = req.body["email"]
    const user = res.locals["user"]
    const user_id = res.locals["user_id"]
    const device_id = req.body["device_id"]
    const user_document = await get_user_details_by_email(user)
    const userID = user_document["_id"]
    const inorder = await place_inorder(userID, device_id, restaurant_id, table_no, menu, order_token, offer_applied, name, phone, email)
    const final_amount = await calculate_amount(restaurant_id,  menu)
    const analytics_document = add_analytics(restaurant_id, "inorders", user_id)
    if(inorder != {} && inorder != undefined){
        res.json({
            "message": "Inorder Placed",
            "status": 200,
            "amount": final_amount,
            "reference": inorder["_id"]
        })
    } else {
        res.status(500)
        res.json({
            "message": "Could not place inorder",
            "status": 500
        })
    }
}

const get_order_summary = async (req, res, next) => {
    const inorder_token = req.headers["x-mazon-token"]
    const user = res.locals["user"]
    const token_document = await get_token_details(inorder_token, user)
    const inorder_check = await get_order_using_token(inorder_token)
    const response = []
    if(inorder_check.length > 0){
        for(var i=0;i<inorder_check.length;i++){
            const current_restaurant = inorder_check[i]["rId"]
            const items = inorder_check[i]["menu"]
            const current_inorder_details = await get_overall_details(current_restaurant, items)
            const order_id = inorder_check[i]["_id"]
            const placed_at = inorder_check[i]["order_date_time"]
            const restaurant_name = await get_restaurant(inorder_check[i]["rId"])
            response.push({
                "restaurant_name": restaurant_name["resName"],
                "items": current_inorder_details,
                "order_id": order_id,
                "name": inorder_check[i]["name"],
                "email": inorder_check[i]["email"],
                "phone": inorder_check[i]["phone"],
                "placed_at": placed_at,
                "table_no": inorder_check[i]["rTable"],
                "offer_applied": token_document["offer_code"]
            })
        }
    }
}

const check_inorder_validity = async (req, res, next) => {
    const email = req.body["email"]
    const inorder = await get_active_inorder_with_email(email)
    if(inorder != null){
        res.status(403)
        res.json({
            "message": "Inorder already present",
            "reference": inorder["_id"],
            "token": inorder["order_token"],
            "status": 403
        })
    } else {
        next()
    }
}

const update_order_controller = async (req, res, next) => {
    const order_id = req.body["order_id"]
    const update_status = req.body["status"]
    const updated_by = req.body["updated_by"]
    const updated_order = await update_inorder(order_id, update_status, updated_by)
    if(updated_order != undefined){
        res.json({
            "message": "Order status updated succesfully",
            "status": 200
        })
    } else {
        res.json({
            "status": 500,
            "message": "Could not update order"
        })
    }
}

const finish_inorder_controller = async (req, res, next) => {
    const order_id = req.body["order_id"]
    const inorder = await show_inorder(order_id)
    if(inorder != {} && inorder != undefined){
        if(inorder["is_paid"] == true){
            const finished_inorder = await finish_inorder(order_id)
            if(finished_inorder["ok"]){
                res.json({
                    "message": "Order completed successfully",
                    "status": 200
                })
            } else {
                res.status(500)
                res.json({
                    "message": "Failed to complete inorder. Try again",
                    "status": 500
                })
            }
        } else {
            res.status(400)
            res.json({
                "message": "Could not find the inorder",
                "status": 404
            })
        }
    } else {
        res.status(400)
        res.json({
            "message": "Could not find the inorder",
            "status": 404
        })
    }
}

const generate_inorder_token = async (req, res, next) => {
    const restaurant_id = req.body["restaurant_id"]
    const user = res.locals.user
    const user_id = res.locals.user_id
    const table_no = req.body["table_no"]
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_document = await get_user_details_by_email(user)
    if(user_document["email"] != undefined){
        const new_token = await create_inorder_token(restaurant_id, table_no, user, ip)
        const analytics_document = add_analytics(restaurant_id, "scans", user_id)
        if(new_token["_id"] != undefined){
            res.json({
                "token": new_token["token"],
                "expiry": new_token["expiry"],
                "status": 200
            })
        } else {
            res.status(500)
            res.json({
                "message": "Unable to create credentials",
                "status": 500
            })
        }
    } else {
        res.status(403)
        res.json({
            "message": "Forbidden",
            "status": 403
        })
    }
}

const validate_inorder_token_controller = async (req, res, next) => {
    try {
        const token = req.headers["x-mazon-token"]
        const user = req.body["email"]
        const restaurant_id = req.body["restaurant_id"]
        const user_document = await get_user_details_by_email(user)
        if(user_document["email"] != undefined){
            const token_document = await validate_inorder_token(token, user, restaurant_id)
            if(token_document){
                res.locals["inorder-token"] = token
                next()
            } else {
                res.json({
                    "message": "Invalid credentials",
                    "status": 401
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
    } catch (error) {
        res.json({
            "message": "Invalid credentials",
            "status": 401
        })
    }
}

module.exports = {
    "calculate_amount": calculate_menu_amount,
    "update_order": update_order_controller,
    "finish_order": finish_inorder_controller,
    "place_inorder": place_inorder_controller,
    "generate_token": generate_inorder_token,
    "validate_token": validate_inorder_token_controller,
    "check_order": check_inorder_validity,
    "get_order_summary": get_order_summary
}