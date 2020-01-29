const express = require('express')
const router = express.Router()
const {
    validate_token
} = require('../controllers/user.controller')
const inorder = require('../controllers/inorder.controller')

router.use(validate_token).use(inorder.check_order).route("/generate").post(inorder.generate_token)

module.exports = router