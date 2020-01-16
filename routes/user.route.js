/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const {
    signin,
    signup,
    token_middleware,
    get_profile,
    get_full_profile,
    get_wallet,
    sendotp
} = require("../controllers/user.controller")
const {
    check_offer__strict_controller
} = require('../controllers/offer.controller')

router.route("/signin").post(signin)
router.route("/process/signin").post(sendotp)
router.route("/signup").post(signup)
// router.use(token_middleware).route("/details").post(get_profile)
// router.route("/profile").post(get_full_profile)
// router.route("/wallet").post(get_wallet)
// router.route("/:restaurantID/check-offer").post(check_offer__strict_controller)

module.exports = router