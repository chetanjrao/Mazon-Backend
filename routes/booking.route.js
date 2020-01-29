/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const express = require("express")
const router = express.Router()
const {
    validate_token
} = require("../controllers/user.controller")
const bookings = require("../controllers/booking.controller")

router.use(validate_token).route("/create").post(bookings.create_booking)
// router.route("/update").patch(bookings.update_booking)
// router.route("/finish").delete(bookings.finish_booking)

module.exports = router