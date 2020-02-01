/*
 * Created on Fri Jan 17 2020
 *
 * Author - Chethan Jagannatha Kulkarni, Director, CoFounder, CTO, Mazon Technologies Pvt. Ltd. 
 * Copyright (c) 2020 Mazon Technologies Pvt. Ltd.
 */

const express = require("express")
const router = express.Router()
const {
    validate_token,
    check_offer,
    check_mobile,
    send_otp_mobile,
    verify_mobile,
    create_trending_con,
    profile,
    wallet,
    report,
    tier,
    claim,
    referral,
    feedback
} = require("../controllers/user.controller")

router.use(validate_token)
router.route("/check-offer").get(check_offer)
router.route('/mobile/check').post(check_mobile)
router.route("/mobile/process").post(send_otp_mobile)
router.route("/mobile/verify").post(verify_mobile)
router.route("/trending/create").post(create_trending_con)
router.route("/profile").post(profile)
router.route("/wallet").get(wallet)
router.route("/report").post(report)
router.route("/tier").get(tier)
router.route("/claim").post(claim)
router.route("/feedback").post(feedback)
router.route("/referral").post(referral)

module.exports = router