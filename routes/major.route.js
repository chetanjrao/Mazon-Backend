const express = require('express')
const router = express.Router()
const {
    token_middleware
} = require('../controllers/user.controller')
const inorder = require('../controllers/inorder.controller')

router.use(token_middleware).use(inorder.check_order).route("/generate").post(inorder.generate_token)

module.exports = router