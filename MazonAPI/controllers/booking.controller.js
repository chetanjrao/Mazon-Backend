/*
 * Created on Wed Sep 25 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const mongoose = require('mongoose')
const {
    validate_booking_token,
    place_booking,
    create_booking_token,
    edit_status,
    finish_booking,
    get_booking_on_reference
} = require("../services/booking.service")
const {
    get_user_details
} = require("../services/user.service")

const create_booking_controller = async (req, res, next) => {
    const rId = req.body["rId"]
    const email = req.body["email"]
    const phone = req.body["phone"]
    const token = res.locals["booking-token"]
    const male = req.body["male"]
    const female = req.body["female"]
    const name = req.body["name"]
    const coupon = req.body["coupon"]
    const date = req.body["date"]
    const time = req.body["time"]
    const booking = await place_booking(rId, email, phone, token, male, female, name, coupon, date, time)
    if(booking["_id"] != undefined){
        res.json({
            "message": "Booking placed",
            "status": 200
        })
    } else {
        res.json({
            "message": "Error placing booking",
            "status": 500
        })
    }
}

const generate_token_controller = async (req, res, next) => {
    const restaurant_id = req.body["restaurant_id"]
    const user = res.locals.user
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_document = await get_user_details(user)
    if(user_document["email"] != undefined){
        const new_token = await create_booking_token(restaurant_id, user, ip)
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

const update_booking_controller = async (req, res, next) => {
    
}

const get_booking_controller = async (req, res, next) => {
    const booking_id = req.body["booking_id"]
    const booking = await get_booking_on_reference(booking_id)
    if(booking["_id"] != undefined){
        res.json({
            "name": booking["name"],
            "mobile": booking["phone"],
            "email": booking["email"],
            "male": booking["male"],
            "female": booking["female"],
            "date": booking["date"],
            "time": booking["time"],
            "status": booking["status"],
            "coupon": booking["coupon"]
        })
    } else {
        res.status(404)
        res.json({
            "message": "Unable to find booking",
            "status": 404
        })
    }
}

const validate_booking_token_controller = async (req, res, next) => {
    try {
        const token = req.headers["x-mazon-booking-token"]
        const user = req.body["user"]
        const restaurant_id = req.body["restaurant_id"]
        const user_document = await get_user_details(user)
        if(user_document["email"] != undefined){
            const token_document = await validate_booking_token(token, user, restaurant_id)
            if(token_document){
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

const finish_booking_controller = async (req, res, next) => {
    const amount = req.body["amount"]
    const payment_mode = req.body["payment_mode"]
    const user = res.locals.user
    const finished_booking = await finish_booking(amount, payment_mode, user)
    if(finished_booking["_id"] != undefined){
        res.status(200)
        res.json({
            "message": "Booking finished successfully",
            "status": 200
        })
    } else {
        res.status(500)
        res.json({
            "message": "Unable to finish booking",
            "status": 500
        })
    }
}

module.exports = {
    "create_booking": create_booking_controller,
    "generate_token": generate_token_controller,
    "finish_booking": finish_booking_controller,
    "get_booking": get_booking_controller,
    "update_booking": update_booking_controller,
    "validate_token": validate_booking_token_controller
}