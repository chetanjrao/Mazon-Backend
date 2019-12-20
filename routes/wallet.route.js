const express = require("express")
const router = express.Router()
const {
    token_middleware
} = require("../controllers/user.controller")

router.use(token_middleware).get()
router.use(token_middleware).delete()
router.use(token_middleware).patch()

module.exports = router