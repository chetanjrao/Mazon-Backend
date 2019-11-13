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
    validate_inorder_token
} = require('../services/inorder.service')
const {
    
} = require("../services/utils.service")
const {
    get_user_details,
    get_user_details_by_email
} = require("../services/user.service")

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
    const inorder = await place_inorder(restaurant_id, table_no, menu, order_token, offer_applied, name, phone, email)
    const final_amount = await calculate_amount(restaurant_id,  menu)
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
    const table_no = req.body["table_no"]
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_document = await get_user_details_by_email(user)
    if(user_document["email"] != undefined){
        const new_token = await create_inorder_token(restaurant_id, table_no, user, ip)
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
    "validate_token": validate_inorder_token_controller
}