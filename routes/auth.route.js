/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const {
    validateotp,
    signup,
    sendotp
} = require("../controllers/user.controller")

router.route("/signup").post(signup)
router.route("/process/signin").post(sendotp)
router.route("/process/validate").post(validateotp)

module.exports = router