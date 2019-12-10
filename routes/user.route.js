/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const {
    signin,
    signup
} = require("../controllers/user.controller")

router.route("/signin").post(signin)
router.route("/signup").post(signup)
// router.route("/update").post(signin)
// router.route("/delete").delete(signin)

module.exports = router