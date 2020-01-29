/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const {
    verifyotp,
    signup,
    sendotp,
    token
} = require("../controllers/user.controller")

router.route("/signin/verify").post(verifyotp)
router.route("/signin/process").post(sendotp)
router.route("/signup/process").post(signup)
router.route("/oauth/token").post(token)

module.exports = router