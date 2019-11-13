const express = require('express')
const router = express.Router()
const OauthController = require('../controllers/oauth.controller')

router.route('/register').post(OauthController.register)
router.route('/authorize').post(OauthController.authorize)
router.route('/token').post(OauthController.token)
router.route('/refresh').post(OauthController.refresh)
router.route('/revoke').patch(OauthController.revoke)
router.route('/delete').delete(OauthController.delete)

module.exports = router