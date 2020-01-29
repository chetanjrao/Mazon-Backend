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
    utilities
} = require('../services/restaurant.service')
const {
    validate_token
} = require('../controllers/user.controller')
const {
    confirm_order,
    serve_order,
    cancel_order
} = require('../controllers/inorder.controller')
const {
    confirm_booking,
    activate_booking,
    get_bookings,
    get_booking,
    finish_booking,
    cancel_booking
} = require('../controllers/booking.controller')
const {
    enableItem,
    disableItem,
    enableFeaturing,
    disableFeaturing,
    addMenu
} = require('../controllers/menu.controller')
const offer_controller = require('../controllers/offer.controller')

router.route('/signin').post(login_partner)
router.route('/signup').post(signup)
router.route('/:restaurantID/utilities').get(async(req, res, next)=>{
    const restaurant_id = req.params["restaurantID"]
    const _utilities = await utilities(restaurant_id)
    res.json(_utilities)
})
router.use(validate_token).route('/profile')
router.route('/notifications')
router.use(check_partner_middleware).route('/inorders/confirm').patch(confirm_order)
router.route('/inorders/cancel').patch(cancel_order)
router.route('/inorders/activate').patch(serve_order)
router.route('/inorders/summary').post(get_order_summary)
router.route('/inorders/:restaurantID').post(restaurant_inorders)
router.route('/offers/:restaurantID/create').post(offer_controller.create_offer_controller)
router.route('/inorders/:restaurantID/specific').post(restaurant_inorders_specific)
router.route('/bookings').post(get_bookings)
router.route('/bookings/confirm').patch(confirm_booking)
router.route('/bookings/cancel').patch(cancel_booking)
router.route('/bookings/activate').patch(activate_booking)
router.route('/bookings/details').post(get_booking)
router.route('/bookings/finish').patch(finish_booking)
router.route('/:restaurantID/menu/:cId/:fId/enable').patch(enableItem)
router.route('/:restaurantID/menu/add').post(addMenu)
router.route('/:restaurantID/offers').post(offer_controller.get_all_offers_controller)
router.route('/:restaurantID/offers/avail').patch(offer_controller.avail_offer_controller)
router.route('/:restaurantID/offers/unavail').patch(offer_controller.unavail_offer_controller)
router.route('/:restaurantID/menu/:cId/:fId/disable').patch(disableItem)
router.route('/:restaurantID/menu/:cId/:fId/featuring/enable').patch(enableFeaturing)
router.route('/:restaurantID/menu/:cId/:fId/featuring/disable').patch(disableFeaturing)

module.exports = router