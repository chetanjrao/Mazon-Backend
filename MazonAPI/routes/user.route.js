/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const {
    signin
} = require("../controllers/user.controller")

router.route("/signin").post(signin)

module.exports = router