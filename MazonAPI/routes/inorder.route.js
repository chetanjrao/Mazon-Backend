/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express = require("express")
const router = express.Router()
const inorder = require("../controllers/inorder.controller")
const {
    token_middleware
} = require("../controllers/user.controller")

router.use(token_middleware).route("/place").post(inorder.place_inorder)
router.route("/update").patch(inorder.update_order)
router.route("/finish").post(inorder.finish_order)

module.exports = router