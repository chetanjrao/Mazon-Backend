/*
 * Created on Sun Sep 15 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
require("dotenv").config()
const {
    express,
    app,
    http
} = require('./helpers/root.helper')
const publicDirectory = require('path').join(__dirname, './public');
app.use(express.static(publicDirectory))
let bodyparser = require('body-parser')
app.use(bodyparser.json())

const RestaurantRouter = require('./routes/restaurant.route')
const OauthRouter = require('./routes/oauth.route')
const InorderRouter = require('./routes/inorder.route')
const UserRouter = require('./routes/user.route')
const BaseRouter = require("./routes/base.route")
const AnalyticsRouter = require("./routes/analytics.route")
const MajorRouter = require('./routes/major.route')
const WaiterRouter = require('./routes/waiter.route')
const PartnerRoute = require('./routes/partner.route')
app.use('/api/secure/inorders/token', MajorRouter)
app.use('/api/library/restaurants',RestaurantRouter)
app.use('/api/secure/oauth2', OauthRouter)
app.use('/api/secure/inorders', InorderRouter)
app.use('/api/secure/accounts', UserRouter)
app.use('/api/library', BaseRouter)
app.use('/api/analytics', AnalyticsRouter)
app.use('/api/waiters', WaiterRouter)
app.use('/api/partners', PartnerRoute)

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



http.listen(9000, function(){
    console.log("Server started at localhost & listening on 9000");
  });
