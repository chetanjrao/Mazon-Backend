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

router.use(token_middleware).route("/summary").post(inorder.get_order_summary)
router.route("/summary/amount").post(inorder.get_order_amount)
router.route("/token").post(inorder.generate_token)
router.use(inorder.validate_token).route("/place").post(inorder.place_inorder)
router.route("/details").get()
router.route("/delete").delete()
router.route("/finish").patch(inorder.finish_order)

module.exports = router