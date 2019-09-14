const express = require('express')
const router = express.Router()
const OauthController = require('../controllers/OauthController')

router.route('/register').post(OauthController.register)


module.exports = router