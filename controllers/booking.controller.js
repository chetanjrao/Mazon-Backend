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
    get_booking_on_reference,
    get_bookings_with_restaurant
} = require("../services/booking.service")
const {
    get_restaurant
} = require('../services/restaurant.service')
const {
    get_user_details
} = require("../services/user.service")
const {
    generate_otp
} = require('../services/utils.service')
const {
    add_analytics
} = require('../services/analytics.service')
const {
    sendNotificationToDevice,
    sendNotificationToDevices
} = require('../helpers/firebase.helper')
const {
    booking_payload,
    booking_comfirm_payload,
    booking_cancel_payload,
    booking_activate_payload,
    booking_finish_payload
} = require('../services/payload.service')

const create_booking_controller = async (req, res, next) => {
    const rId = req.body["rId"]
    const email = req.body["email"]
    const phone = req.body["phone"]
    const otp = generate_otp(6)
    const male = req.body["male"]
    const female = req.body["female"]
    const name = req.body["name"]
    const coupon = req.body["coupon"]
    const date = req.body["date"]
    const time = req.body["time"]
    const user_id = res.locals["user_id"]
    const device_id = req.body["device_id"]
    const booking = await place_booking(rId, email, phone, otp, male, female, name, coupon, date, time, user_id, device_id)
    const analytics_document = add_analytics(rId, "bookings", user_id)
    sendNotificationToDevice(device_id, booking_payload("", name, otp.toString()))
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

const confirm_booking_controller = async (req, res, next) => {
    const user = res.locals["user_id"]
    const booking_id = req.body["booking_id"]
    const booking_details = await get_booking_on_reference(booking_id)
    if(booking_details != null){
        const updated_status_document = await edit_status(booking_id, 2, user)
        const restaurant = await get_restaurant(booking_details["rId"])
        sendNotificationToDevices(booking_details["device_id"], booking_comfirm_payload("", booking_details["name"], restaurant["name"]))
        if(updated_status_document != null){
            res.send("ok") 
        } else {
            res.status(500)
            res.json({
                "message": "Error updating booking",
                "status": 500
            })
        }
    } else {
        res.status(404)
        res.json({
            "message": "Invalid booking requested",
            "status": 404
        })
    }
}

const cancel_booking_controller = async (req, res, next) => {
    const user = res.locals["user_id"]
    const booking_id = req.body["booking_id"]
    const booking_details = await get_booking_on_reference(booking_id)
    if(booking_details != null){
        const updated_status_document = await edit_status(booking_id, 5, user)
        const restaurant = await get_restaurant(booking_details["rId"])
        sendNotificationToDevices(booking_details["device_id"], booking_cancel_payload("", booking_details["name"], restaurant["name"]))
        if(updated_status_document != null){
            res.send("ok") 
        } else {
            res.status(500)
            res.json({
                "message": "Error updating booking",
                "status": 500
            })
        }
    } else {
        res.status(404)
        res.json({
            "message": "Invalid booking requested",
            "status": 404
        })
    }
}

const activate_booking_controller = async (req, res, next) => {
    const user = res.locals["user_id"]
    const booking_id = req.body["booking_id"]
    const booking_details = await get_booking_on_reference(booking_id)
    if(booking_details != null){
        const updated_status_document = await edit_status(booking_id, 3, user)
        const restaurant = await get_restaurant(booking_details["rId"])
        sendNotificationToDevices(booking_details["device_id"], booking_activate_payload("", booking_details["name"], restaurant["name"]))
        if(updated_status_document != null){
            res.send("ok") 
        } else {
            res.status(500)
            res.json({
                "message": "Error updating booking",
                "status": 500
            })
        }
    } else {
        res.status(404)
        res.json({
            "message": "Invalid booking requested",
            "status": 404
        })
    }
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
    const user = res.locals["user_id"]
    const booking_id = req.body["booking_id"]
    const finished_booking = await finish_booking(amount, payment_mode, user, booking_id)
    const restaurant = await get_restaurant(finished_booking["rId"])
    sendNotificationToDevices(finished_booking["device_id"], booking_finish_payload("", finished_booking["name"], restaurant["name"], amount))
    if(finished_booking["_id"] != undefined){
        res.send("ok")
    } else {
        res.status(500)
        res.json({
            "message": "Unable to finish booking",
            "status": 500
        })
    }
}

const get_bookings_controller = async (req, res, next) => {
    const restaurant_id = req.body["restaurant_id"]
    const bookings = await get_bookings_with_restaurant(restaurant_id)
    res.json(bookings)
}

module.exports = {
    "create_booking": create_booking_controller,
    "generate_token": generate_token_controller,
    "finish_booking": finish_booking_controller,
    "get_booking": get_booking_controller,
    "confirm_booking": confirm_booking_controller,
    "cancel_booking": cancel_booking_controller,
    "activate_booking": activate_booking_controller,
    "validate_token": validate_booking_token_controller,
    "get_bookings": get_bookings_controller
}