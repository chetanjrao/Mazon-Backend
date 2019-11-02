/*
 * Created on Sun Sep 15 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

var mongoose  = require('mongoose')
var ordersMongoose = require('mongoose');
var bcrypt = require('bcrypt')
const {
    express,
    app,
    http
} = require('./helpers/root.helper')
var sanitization = require('mongo-sanitize');
var publicDirectory = require('path').join(__dirname, './public');
var uuid = require('uuid/v4')
var nodeMailer = require('nodemailer')
app.use(express.static(publicDirectory))
let bodyparser = require('body-parser')
app.use(bodyparser.json())
const emailTransporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "1by17ec037@bmsit.in",
        pass: "Chethanwins@2025"
    }
})
const RestaurantRouter = require('./routes/restaurant.route')
const OauthRouter = require('./routes/oauth.route')
const InorderRouter = require('./routes/inorder.route')
const UserRouter = require('./routes/user.route')
app.use('/api/library/restaurants',RestaurantRouter)
app.use('/api/secure/oauth2', OauthRouter)
app.use('/api/secure/inorders', InorderRouter)
app.use('/api/secure/accounts', UserRouter)

app.use((err, req, res, next)=>{
    const error = app.get('env') === 'development' ? err : {}
    error.status = err.status || 500
    res.status(error.status).json({
        "error": {
            "message": error.message,
            "status": error.status
        }
    })
})

app.get

http.listen(9000, function(){
    console.log("Server started at localhost & listening on 9000");
  });
