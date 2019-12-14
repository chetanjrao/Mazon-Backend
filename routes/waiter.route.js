const express = require('express')
const router = express.Router()
const {
    signup,
    login_waiter,
    check_waiter_middleware,
    waiter_inorders
} = require('../controllers/waiter.controller')
const {
    token_middleware
} = require('../controllers/user.controller')
const {
    place_inorder,
    generate_token,
    check_order,
    validate_token
} = require('../controllers/inorder.controller')

router.route('/signin').post(login_waiter)
router.route('/signup').post(signup)
router.use(token_middleware).route('/profile')
router.route('/notifications')
router.route('/token').get(generate_token)
router.use(check_waiter_middleware).route('/finish')
router.route('/inorders').post(waiter_inorders)
router.use(validate_token).route('/inorder').post(place_inorder)
module.exports = router