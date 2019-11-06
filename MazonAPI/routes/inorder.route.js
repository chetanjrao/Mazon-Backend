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

router.use(token_middleware).route("/token").post()
router.use(token_middleware).use(inorder.validate_token).route("/place").post(inorder.place_inorder)
router.use(token_middleware).use(inorder.validate_token).route("/update").patch(inorder.update_order)
router.use(token_middleware).use(inorder.validate_token).route("/details").get()
router.use(token_middleware).use(inorder.validate_token).route("/delete").delete()
router.use(token_middleware).use(inorder.validate_token).route("/finish").patch(inorder.finish_order)

module.exports = router