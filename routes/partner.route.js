const express = require('express')
const router = express.Router()
const {
    signup,
    login_partner,
    check_partner_middleware,
    restaurant_inorders,
    restaurant_inorders_specific,
    get_order_summary
} = require('../controllers/partner.controller')
const {
    token_middleware
} = require('../controllers/user.controller')
const {
    confirm_order,
    serve_order
} = require('../controllers/inorder.controller')
const {
    confirm_booking,
    activate_booking,
    get_bookings,
    get_booking
} = require('../controllers/booking.controller')

router.route('/signin').post(login_partner)
router.route('/signup').post(signup)
router.use(token_middleware).route('/profile')
router.route('/notifications')
//router.use(check_partner_middleware).route('/inorders/confirm').patch(confirm_order)
router.route('/inorders/confirm').patch(confirm_order)
router.route('/inorders/activate').patch(serve_order)
router.route('/inorders/summary').post(get_order_summary)
router.route('/inorders/:restaurantID').post(restaurant_inorders)
router.route('/inorders/:restaurantID/specific').post(restaurant_inorders_specific)
router.route('/bookings').post(get_bookings)
router.route('/bookings/confirm').patch(confirm_booking)
router.route('/bookings/activate').patch(activate_booking)
router.route('/bookings/details').post(get_booking)

module.exports = router