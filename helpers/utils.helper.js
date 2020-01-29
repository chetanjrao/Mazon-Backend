/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const nodeMailer = require("nodemailer")
const emailTransporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})
const multer = require("multer")
const crypto = require("crypto")
var storage = multer.diskStorage({
    destination: './public/images/food',
    filename: function (req, file, cb) {
        var filemimeType = file.mimetype.split("/")[1]
        var fileName = crypto.randomBytes(14).toString("hex")
        cb(null, fileName + '_' + Date.now() + `.${filemimeType}`)
    }
})

module.exports = {
    "mailer": emailTransporter,
    "storage": storage
}