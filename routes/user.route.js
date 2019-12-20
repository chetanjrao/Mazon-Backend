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
router.route("/signup").post(signin)
router.route("/update").post(signin)
router.route("/delete").delete(signin)

module.exports = router