/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */



var mongoose  = require('mongoose')
var ordersMongoose = require('mongoose');
var sampleMongoose = require('mongoose')
var bcrypt = require('bcrypt')
var globals = require('./modals/globals')
const saltRounds = 10;
const crypto = require('crypto')
var jsonwebtoken = require('jsonwebtoken');
var ordersConnection = ordersMongoose.createConnection('mongodb://localhost:27017/Orders', { useNewUrlParser: true, useCreateIndex: true })
var express = require('express')
var sanitization = require('mongo-sanitize');
var publicDirectory = require('path').join(__dirname, './public');
var app = express()
var uuid = require('uuid/v4')
const GOLD_TIER_WALLET_PRICE = 800
const SILVER_TIER_WALLET_PRICE = 500
const BRONZE_TIER_WALLET_PRICE = 200
const PER_BOOKING_POINTS = 30
const PER_REVIEW_POINTS = 10
/*************************** Bill Amount, Note *************/
var nodeMailer = require('nodemailer')
app.use(express.static(publicDirectory))
var http = require('http').Server(app)
var multer = require('multer')
var socketio = require('socket.io')(http, {
    path: '/secure/sockets',
    serveClient: false,
    cookie: "MazonSSC" //Mazon Secure Socket Connection
})
let bodyparser = require('body-parser')
app.use(bodyparser.json())
const key = new Buffer.alloc(16, "%Z_4$7x!A%D*G-Ka")
const iv = new Buffer.alloc(8, "?D(G+KbP");
var mazonConnection = mongoose.createConnection("mongodb://localhost:27017/Mazon", { useNewUrlParser: true, useCreateIndex: true })
var restaurants = mazonConnection.model('Restaurants', require('./modals/restaurantModal'))
var users = mazonConnection.model('Users', require('./modals/User'))
var oauth = mazonConnection.model('Oauth', require('./modals/Oauth'))
var bookings = mazonConnection.model('Booking', require('./modals/Booking'))
var ratingReviews = mazonConnection.model('RatingReview', require('./modals/RatingReview'));
exports.ratingReviews = ratingReviews;
var wallet = mazonConnection.model('Wallet', require('./modals/Wallet'))
var transaction = mazonConnection.model('Transaction', require('./modals/Transaction'))
var analytic = mazonConnection.model('Analytic', require('./modals/Analytics'))
var socket = mazonConnection.model('Socket', require('./modals/Socket'))
var combination = mazonConnection.model('Combination', require('./modals/Combinations'))
var food = mazonConnection.model('Food', require('./modals/Food'))
var inorder = mazonConnection.model('Inorder', require('./modals/Inorder'))
const RestaurantRouter = require('./routes/RestaurantRoutes')
const OauthRouter = require('./routes/OauthRoutes')
app.use('/api/library/restaurants',RestaurantRouter)
app.use('/api/secure/oauth2', OauthRouter)

app.get('/', function(req, res){
    var client_secret = crypto.randomBytes(16).toString('hex')
    res.send(client_secret)
})

/* 
Web Socket Start
*/
socketio.on("connection",function(socketClient){
    sockets.push(socketClient.id)
    var deviceID = socketClient.handshake.headers["x-request-device-id"]
    var accessToken = socketClient.handshake.headers["authorization"]
    socketClient.on('newinorder', function(){
        console.log('new inorder by : ' + socketClient.id)
    })
    socketio.to(sockets).emit('inorderrecieved', 'nikal laude')
    // try{
    //     var accessTokenDecrypted = DecryptForParams(accessToken)
    //     var identity = accessTokenDecrypted.identity
    //     oauth.findOne({ "accessToken": accessToken }, function(findErr, findResp){
    //         if(findErr){
    //             console.log(findErr)
    //             socketClient.disconnect()
    //         } else if(findResp){
    //             socket.findOne({ "refID": identity }, function(soErr, soResp){
    //                 if(soErr){
    //                     console.log(soErr)
    //                     socketClient.disconnect()
    //                 } else if(soResp) {
    //                     if(deviceID != soResp.deviceID){
    //                         socket.updateOne({ "refID": identity }, { $set: { "deviceID": deviceID, "timeOfRecentConnection": new Date().toUTCString(), "connectionID": socketClient.id } }, function(updateErr, updateResp){

    //                         })
    //                     }
    //                 } else {

    //                 }
    //             })
    //         } else {
    //             socketClient.emit('authErr')
    //             socketClient.disconnect()
    //         }
    //     })
    // }catch(err){
    //     console.log(err)
    // }
})


/* 
Web Socket End
*/




const TokenUsageTypes = {
    "ACCESS": 1,
    "REFRESH": 2,
    "INORDER": 3,
    "BOOKING": 4,
    "PAYMENT": 5
}

var emailTransporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "1by17ec037@bmsit.in",
        pass: "Chethanwins@2025"
    }
})
// socketio.on('connection', function(socket){
//     socket.on('disconnect', function(){
//         console.log('disconnected')
//     })
// })


app.post('/api/secure/menu/', function(req, res){
    var menuToken = req.headers["x-mazon-menu-request-token"]
    var accessToken = req.headers["authorization"]
    var restaurantId = req.body.restaurantId
    var menu = []
    if(menuToken && accessToken && restaurantId != undefined){
        restaurants.find({'_id': restaurantId }, function(err, response){
            restaurantMenu = response[0].menu;
            restaurantMenu.forEach(menuSingle => {
                menu.push({
                    name: menuSingle.fName,
                    price: menuSingle.fPrice,
                    veg: menuSingle.veg,
                    fType: menuSingle.fType,
                    image: menuSingle.fImage
                })
            });
             res.send(menu)
        })
    } else {
        res.status(403).json({
            "message" : "Access Forbidden",
            "status": 403
        })
    }

})


/********************* Login & Signup ***************************/

app.post('/accounts/signin', function(req, res){
    
})

app.get('/accounts/signup/emailVerifier/:emailVerificationToken', function(req, res){
    var emailVerificationToken = req.params.emailVerificationToken
    users.findOne({"emailVerificationToken": emailVerificationToken}, function(stepError, stepResponse){
        if(stepError){
            console.log(stepError)
            res.status(500)
            res.json({
                "message": "Internal Server Error",
                "status": res.statusCode
            })       
        } else if(stepResponse){
            try{
                var decryptedData = decrypt(emailVerificationToken)
                var decryptedJSON = JSON.parse(decryptedData)
                var time  = IndianTimeResponder()
                time = IndianTimeResponder()
                var decryptedTime = new Date(decryptedJSON.expiration)
                if(time <= decryptedTime){
                    users.findOne({"email": decryptedJSON.to}, function(err, response){
                        if(err){
                            console.log(err)
                            res.json({
                                "status": 500,
                                "message": "Internal Server Error"
                            })
                        } else if(response){
                            if(response.isEmailVerified){
                                res.json({
                                    "status": 302,
                                    "message": "Email Already Verified"
                                })
                            } else {
                                users.findOneAndUpdate({"email": decryptedJSON.to}, {"isEmailVerified": true}, function(updateError, updateResponse){
                                    var transactionID = GenerateRandomID(12);
                                    var transactionType = "CREDIT"
                                    var transactionAmount = 10
                                    var transactionMessage = "Registration Reward of 10 Points"
                                    var transactionTime = IndianTimeResponder()
                                    wallet.findOne({ "wID": updateResponse.walletID }, function(walletFinderr, walletFindResp){
                                        if(walletFinderr){
                                            console.log(walletFinderr)
                                            res.status(500)
                                            res.json(transactionTime)
                                        } else {
                                            transaction.create(new transaction({
                                                transactionID: transactionID,
                                                purpose: transactionMessage,
                                                amount: transactionAmount,
                                                type: transactionType,
                                                dateTime: transactionTime,
                                                ip: req.connection.remoteAddress
                                            }), function(insertTErr, insertTResp){
                                                if(insertTErr){
                                                    console.log(insertTErr)
                                                    res.status(500)
                                                    res.json(generateInternalServerError())
                                                } else {
                                                    wallet.updateOne({ '_id': walletFindResp._id }, { 
                                                        $set: {
                                                        "walletPoints": walletPointsDecider(walletFindResp.walletPoints, transactionType, updateResponse.isPremium, transactionAmount),
                                                        "lastTransactionTime": IndianTimeResponder()
                                                    }, $push: {"history": insertTResp.transactionID }
                                                    },function(creErr, creResp){

                                                    })
                                                }
                                            })
                                        }
                                    })
                                    if(updateError){
                                        console.log(updateError)
                                        res.json({
                                            "status": 500,
                                            "message": "Internal Server Error"
                                        })
                                    } else {
                                        res.json({
                                            "message": "Email Verified",
                                            "status": 200
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.status(400)
                    res.json({
                        "message": "Verification Token Expired",
                        "status": 400
                    })
                }
            } catch(ex){
                console.log(ex)
                res.status(400)
                res.send({
                    "message": "Invalid Token. Bad Request",
                    "status": 400
                })
            }
        } else {
            res.status(400)
            res.json({
                "message": "Invalid Token",
                "status": res.statusCode
            })
        }
    })
})

app.post('/accounts/signup/commonuser', function(req, res){
    var email = sanitization(req.body.email);
    var password = sanitization(req.body.password);
    var name = sanitization(req.body.name);
    var mobileNo = sanitization(req.body.mobileNo);
    var lastLoginTime = IndianTimeResponder()
    var registrationTime = IndianTimeResponder()
    var userType = 1
    const hashedPassword = bcrypt.hashSync(password, saltRounds)
    users.findOne({ $or: [
        {
            "email": {
                $in: [email]
            }
        },
        {
            "mobile": {
                $in: [mobileNo]
            }
        }
    ] } , function(error, response){
        if(error){
            console.log(error)
            res.send({
                "status": 500,
                "message": "Internal Server Error"
            }).status(500)
        } else if(response) {
            res.send({
                "status": 302,
                "message": "User Already Exists"
            }).status(302)
        } else {
            users.create(new users({
                email : email,
                password : hashedPassword,
                name: name,
                mobile : mobileNo,
                lastLoginTime : lastLoginTime,
                registrationTime : registrationTime,
                userType : userType,

            }), function(err, insertResponse){
                if(err) {
                    console.log(err)
                    res.json({
                        "message" : "Internal Server Error",
                        "status" : 500
                    }).sendStatus(500)
                } else {
                    var accessTokenPayload = {
                        "usageType": TokenUsageTypes.ACCESS,
                        "issuer": "Mazon",
                        "identity": insertResponse._id,
                        "expiry": ExpiryTimeGenerator(45*24*60*60*1000)
                    }
                    var refreshTokenPayload = {
                        "usageType": TokenUsageTypes.REFRESH,
                        "issuer": "Mazon",
                        "identity": insertResponse._id,
                        "expiry": ExpiryTimeGenerator(90*24*60*60*1000)
                    }
                    // var inOrderAccessToken = {
                    //     "usageType": TokenUsageTypes.INORDER,
                    //     "issuer": "Mazon",
                    //     "identity": insertResponse._id,
                    //     "expiry": ExpiryTimeGenerator(24*60*60*1000)
                    // }
                    // var bookingAccessToken = {
                    //     "usageType": TokenUsageTypes.INORDER,
                    //     "issuer": "Mazon",
                    //     "identity": insertResponse._id,
                    //     "expiry": ExpiryTimeGenerator(24*60*60*1000)
                    // }
                    var emailEncryptionPayload = {
                        "purpose": "Email Verfication",
                        "issuer": "Mazon Services Pvt. Ltd.",
                        "to": insertResponse.email,
                        "expiration": ExpiryTimeGenerator(3*24*60*60*1000)
                    }
                    var accessToken = encrypt(JSON.stringify(accessTokenPayload))
                    accessToken += '.' + EncodeStringtoHex((insertResponse._id).toString())
                    var refreshToken = encrypt(JSON.stringify(refreshTokenPayload))
                    refreshToken += '.' + EncodeStringtoHex((insertResponse._id).toString())
                    // var mazonInorderToken = encrypter.update(JSON.stringify(inOrderAccessToken), 'hex', 'hex')
                    // mazonInorderToken += encrypter.final('hex')
                    // mazonInorderToken += '.' + EncodeStringtoHex(insertResponse._id)
                    // var bookingsToken = encrypter.update(JSON.stringify(bookingAccessToken), 'hex', 'hex')
                    // bookingsToken += encrypter.final('hex')
                    // bookingsToken += '.' + EncodeStringtoHex(insertResponse._id)
                    var emailVerificationToken = encrypt(JSON.stringify(emailEncryptionPayload))
                    let emailPayload = {
                        from: '"Mazon Services Pvt. Ltd." <1by17ec037@bmsit.in>',
                        to: insertResponse.email,
                        subject: "Account Verification | Mazon Services Pvt. Ltd.",
                        html:"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title> Mazon | Email Verification </title>    </head>        <body>                <div style=\" @import url('https://fonts.googleapis.com/css?family=Noto+Sans+HK&display=swap'); margin: auto; width: 400px; font-family: 'Noto Sans HK', sans-serif; height: 600px; background-image: url('http://innovation.bmsit.ac.in/EmailBackground1.png'); background-position: center; background-size: cover; background-repeat: no-repeat\">                        <div>                                <div style=\"text-align: center\"> <img src=\"http://innovation.bmsit.ac.in/mazon-01.png\" height=\"185\" width=\"130\" />                                </div>            <div class=\"description\">                <h2>Hi "+ insertResponse.name +", </h2><br/><p>Welcome to Mazon. Click the below link to verify your email address.</p>                <span style=\"font-size: 11px; color: green\"><u>Note:</u> The below verification link is valid for 3 days only</span>            </div>            <br/>            <div style=\"text-align: center\">                <a href=\"http://localhost:9000/accounts/signup/emailVerifier/"+ emailVerificationToken + "\"><button type=\"button\" class=\"btn\" style=\"background-color: #007EFC;height: 40px;outline: none;border: 0;padding: 10px 20px 10px 20px;border-radius: 6px;cursor: pointer;font-size: 16px;color: #fff \">Click to Verify</button></a>                <br/><br/><br/><br/>                <div style=\"font-size: 11px; color: #8c8c8c; bottom: 0;\">You recieved this email because you have registered with Mazon <br/>&copy; 2019 Mazon Services Pvt. Ltd., Abcd Area, Bangalore - 123456</div>            </div>        </div>    </div>               </body></html>"
                    }
                    var walletID = GenerateRandomID(10)
                    var walletToken = uuid()
                    wallet.create(new wallet({
                        uID: insertResponse._id,
                        wID: walletID,
                        walletPoints: 0,
                        walletAccessToken: walletToken,
                    }))
                    users.findOneAndUpdate({"email": insertResponse.email}, { "emailVerificationToken": emailVerificationToken, "walletID": walletID, "walletToken": walletToken }, function(updateError, updateResponse){
                        if(updateError){
                            res.status(500)
                            res.json(generateInternalServerError())
                        } else {
                            oauth.create(new oauth({
                                refID: insertResponse._id,
                                refIdentity: insertResponse.email,
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }), function(oauthError, oauthResponse){
                                if(oauthError){
                                    console.log(oauthError);
                                    res.json({
                                        "message": "Internal Server Error",
                                        "status": 500
                                    }).sendStatus(500)
                                } else if(oauthResponse) {
                                    emailTransporter.sendMail(emailPayload, function(err,emailResponse){
                                        if(err){
                                            console.log(err)
                                        } 
                                    })
                                    res.json({
                                        "message": "User Registered. Verification Email Sent",
                                        "status": 200
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
   
})

function BookingsTokenGenerator(restaurantID, email){
    let bookingsRequestPayload = {
        "usageType": TokenUsageTypes.BOOKING,
        "issuer": "Mazon",
        "identity": email,
        "requestFor": restaurantID,
        "expiry": ExpiryTimeGenerator(24*60*60*1000)
    }
    let cipher = crypto.createCipheriv('aes-128-ccm', Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(bookingsRequestPayload));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}



app.get('/accounts/tokenAccess/generateBookingsToken/:restaurantID', function(req, res){
    var requestAccessToken_ = req.headers["authorization"]
    var requestAccessToken = requestAccessToken_.substring(7, requestAccessToken_.length-1)
    var requestRestaurant = req.params.restaurantID
    if(requestAccessToken != undefined && requestRestaurant != undefined){
        restaurants.findOne({"_id": requestRestaurant}, function(resErr, resResp){
            if(resErr){
                console.log(resErr)
                res.status(500)
                res.json({
                    "status": 500,
                    "message": "Internal Server Error"
                })
            } else if(resResp){
                try{
                    var userDecryption = DecryptForParams(requestAccessToken)
                    var userID = userDecryption.identity
                    users.findOne({"_id": userID}, function(err, resp){
                        if(err){
                            console.log(err)
                            res.status(500)
                            res.json({
                                "status": 500,
                                "message": "Internal Server Error"
                            })
                        } else if(resp){
                            var email = resp.email
                            var bookingsToken = BookingsTokenGenerator(requestRestaurant, email)
                            oauth.findOneAndUpdate({"refIdentity": email}, { "mazonBookingsToken": bookingsToken }, function(upErr, upResp){
                                if(upErr){
                                    console.log(upErr)
                                    res.json({
                                        "status": 500,
                                        "message": "Internal Server Error"
                                    })
                                } else if(upResp){
                                    res.json({
                                        "status": 200,
                                        "message": bookingsToken
                                    })
                                }
                            })
                        } else {
                            res.status(401)
                            res.json({
                                "message": "Unauthorized",
                                "status": 401
                            })
                        }
                    })
                } catch(ex){
                    console.log(ex)
                    res.status(400)
                    res.json({
                        "message": "Invalid Request Token",
                        "status": 400
                    })
                }
            } else {
                res.status(400)
                res.json({
                    "message": "Invalid Restaurant Requested",
                    "status": 400
                })
            }
        })
    } else {
        res.status(400)
        res.json({
            "message": "Invalid Argument Exception",
            "status": 400
        })
    }
    
})

app.post('/bookings/apply/table/:restaurantID', function(req, res){
    var requestAccessToken_ = req.headers["authorization"]
    var requestAccessToken = requestAccessToken_.substring(7, requestAccessToken_.length-1)
    var requestToken = req.headers["x-mazon-booking-request-token"]
    var urlRequestRestaurant = req.params.restaurantID
    try{
        var accessDecryptedJSON = DecryptForParams(requestAccessToken)
        var objectIdentity = accessDecryptedJSON.identity
        oauth.findOne({"refID": objectIdentity, "mazonBookingsToken": requestToken}, function(err, response){
            if(err){
                console.log(err)
                res.status(500)
                res.json({
                    "status": 500,
                    "message": "Internal Server Error"
                })
            } else if(response){
                try{
                    var decrytedJSON = DecryptForBookingsParams(requestToken)
                    var expiry = decrytedJSON.expiry
                    var identityEmail = decrytedJSON.identity
                    var requestRestaurant = decrytedJSON.requestFor
                    if(identityEmail == response.refIdentity && requestRestaurant == urlRequestRestaurant){
                        if(IndianTimeResponder() < expiry){
                            var bookingID = GenerateRandomID(8)
                            var bookingDate = req.body.bookingDate
                            var bookingTime = req.body.bookingTime
                            var bookingRestaurant = urlRequestRestaurant
                            var bookingEmail = req.body.email
                            var bookingMale = req.body.male
                            var bookingFemale = req.body.female
                            var bookingPhone = req.body.phone
                            var bookingCoupon = req.body.coupon
                            var bookingName = req.body.name
                            bookings.create(new bookings({
                                id: bookingID,
                                restaurant: bookingRestaurant,
                                email: bookingEmail,
                                date: bookingDate,
                                male: bookingMale,
                                female: bookingFemale,
                                phone: bookingPhone,
                                time: bookingTime,
                                name: bookingName,
                                coupon: bookingCoupon
                            }))

                        } else {
                            res.status(400)
                            res.json({
                                "message": "Token Expired",
                                "status": 400
                            })
                        }
                    }else {
                        res.status(400)
                        res.json({
                            "message": "Token Invalid",
                            "status": 400
                        })
                    }
                    
                } catch(ex){
                    console.log(ex)
                    res.status(400)
                    res.json({
                        "message": "Invalid Request Token",
                        "status": 400
                    })
                }

            } else {
                res.status(400)
                res.json({
                    "message": "Invalid Request Token",
                    "status": 400
                })
            }
        })
    } catch(exp){
        console.log(exp)
        res.status(400)
        res.json({
            "message": "Invalid Request Token",
            "status": 400
        })
    }
})


function IndianTimeResponder(){
    return new Date()
}


function EncodeStringtoBase64(string){
    return Buffer.from(string).toString('base64')
}

function EncodeStringtoHex(string){
    return Buffer.from(string).toString('hex')
}

function ExpiryTimeGenerator(expiry){
    return new Date(new Date().getTime() + (expiry)).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    })
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}

function DecodeHextoString(string){
    return Buffer.from(string, 'hex').toString()
}


function getUsernameAndPassword(base64DecodedString){
    var authSplitString = base64DecodedString.split(':')
    return {
        email: authSplitString[0],
        password: authSplitString[1]
    }
}
/********************** Login & Signup End  *********************/

function checkAccessTokenEncryptionValidity(menuToken){
    return true
}
function getAccessProfileTokens(headers){
    return {
        accessToken: headers["authorization"],
        profileToken: headers["x-profileRequest-token"]
    }
}

function accessTokenValidity(accessToken){
    return true
}

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-128-ccm', Buffer.from(key), iv);
    let encrypted = cipher.update(text, );
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
   }
   
function decrypt(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-128-ccm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString()

}

function DecryptForParams(text) {
    console.log(text)
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-128-ccm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    console.log(decrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    var finalDecryptedJSON = JSON.parse(decrypted)
    return {
        "usageType": finalDecryptedJSON.usageType,
        "issuer": finalDecryptedJSON.issuer,
        "identity": finalDecryptedJSON.identity,
        "expiry": finalDecryptedJSON.expiry
    }
}

function DecryptForBookingsParams(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-128-ccm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    var finalDecryptedJSON = JSON.parse(decrypted)
    return {
        "requestFor": finalDecryptedJSON.requestFor,
        "usageType": finalDecryptedJSON.usageType,
        "issuer": finalDecryptedJSON.issuer,
        "identity": finalDecryptedJSON.identity,
        "expiry": finalDecryptedJSON.expiry
    }
}

function GenerateRandomID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

/*********** 28/05/19 */

  /*********** 29/05/2019 */
  app.get('/api/public/library/restaurants/', function(req, res){
    var requestQueryType = req.query.requestQueryType
    responseRestaurants = []
    switch(requestQueryType){
        case "popular":
            restaurants.find({"popularity":{"$gte": 8}}).limit(15).sort({"popularity": -1}).exec(function(err, response){
                if(err){
                    console.log(err);
                    res.send(err)
                } else {
                    response.forEach(restaurant => {
                        ratingFinal = 0
                        reviewCount = 0
                        responseRestaurants.push({
                            id: restaurant._id,
                            name: restaurant.name,
                            address: restaurant.address,
                            locality: restaurant.locality,
                            ratings: restaurant.ratingReviews.forEach(rating => {
                                if(rating.isValid){
                                    ratingFinal += rating["rating"]
                                    reviewCount += 1
                                } else {
                                    reviewCount = 0
                                }
                            }),
                            ratings: (ratingFinal/reviewCount).toFixed(1),
                            priceForTwo: restaurant.priceForTwo,
                            images: "http://localhost:9000//images/restaurants/"+ restaurant.images[0], 
                            reviewsCount: reviewCount
                        })
                    })

                    res.json(responseRestaurants)
                }
            })
            break;
            case "popularNear":
                requestLocality = req.query.locality
                    restaurants.find().and([{"popularity":{ $gte: 6 } },{"locality": requestLocality}]).limit(15).sort({"popularity": -1}).exec(function(err, response){
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                "message": "Internal Server Error"
                            })
                        } else {
                            response.forEach(restaurant => {
                                ratingFinal = 0
                                reviewCount = 0
                                responseRestaurants.push({
                                    id: restaurant._id,
                                    name: restaurant.name,
                                    address: restaurant.address,
                                    locality: restaurant.locality,
                                    ratings: restaurant.ratingReviews.forEach(rating => {
                                        if(rating.isValid){
                                            ratingFinal += rating["rating"]
                                            reviewCount += 1
                                        } else {
                                            reviewCount = 1
                                        }
                                    }),
                                    ratings: ratingFinal/reviewCount,
                                    priceForTwo: restaurant.priceForTwo,
                                    images: restaurant.images[0], 
                                    reviewsCount: reviewCount
                                })
                            })
        
                            res.json(responseRestaurants)
                        }
                    })
                    break;
        case "near":
        //var coordinatesQuery = req.query.requestCoordinates;
        var coordinates = [13.1333682,77.5651881]
        restaurants.find({"location" : {$nearSphere:{$geometry:{"type": "Point", "coordinates": coordinates}, $maxDistance: 5000}}}).sort({"popularity": -1}).exec(function(err, response){
            if(err){
                console.log(err);
                res.status(500).json({
                    "message": "Internal Server Error"
                })
            } else {
                response.forEach(restaurant => {
                    ratingFinal = 0
                    reviewCount = 0
                    responseRestaurants.push({
                        id: restaurant._id,
                        name: restaurant.name,
                        address: restaurant.address,
                        locality: restaurant.locality,
                        ratings: restaurant.ratingReviews.forEach(rating => {
                            if(rating.isValid){
                                ratingFinal += rating["rating"]
                                reviewCount += 1
                            } else {
                                reviewCount = 1
                            }
                        }),
                        ratings: ratingFinal/reviewCount,
                        priceForTwo: restaurant.priceForTwo,
                        images: restaurant.images[0], 
                        reviewsCount: reviewCount
                    })
                })

                res.json(responseRestaurants)
            }
        })
        break;
        case "featured":
        restaurants.find({"isFeatured": true}).sort({"popularity": -1}).exec(function(feaErr, feaResp){
            if(feaErr){
                console.log(feaErr)
                res.status(500)
                res.json({
                    "message": "Internal Server Error",
                    "status": 500
                })
            } else{
                feaResp.forEach(restaurant => {
                    ratingFinal = 0
                    reviewCount = 0
                    responseRestaurants.push({
                        id: restaurant._id,
                        name: restaurant.name,
                        address: restaurant.address,
                        locality: restaurant.locality,
                        ratings: restaurant.ratingReviews.forEach(rating => {
                            if(rating.isValid){
                                ratingFinal += rating["rating"]
                                reviewCount += 1
                            } else {
                                reviewCount = 1
                            }
                        }),
                        ratings: ratingFinal/reviewCount,
                        priceForTwo: restaurant.priceForTwo,
                        images: restaurant.images[0], 
                        reviewsCount: reviewCount
                    })
                })

                res.json(responseRestaurants)
            }
        })
        break;
        case "hangout":
        restaurants.find({"isHangoutPlace": true}).sort({"popularity": -1}).exec(function(feaErr, feaResp){
            if(feaErr){
                console.log(feaErr)
                res.status(500)
                res.json({
                    "message": "Internal Server Error",
                    "status": 500
                })
            } else{
                feaResp.forEach(restaurant => {
                    ratingFinal = 0
                    reviewCount = 0
                    responseRestaurants.push({
                        id: restaurant._id,
                        name: restaurant.name,
                        address: restaurant.address,
                        locality: restaurant.locality,
                        ratings: restaurant.ratingReviews.forEach(rating => {
                            if(rating.isValid){
                                ratingFinal += rating["rating"]
                                reviewCount += 1
                            } else {
                                reviewCount = 1
                            }
                        }),
                        ratings: ratingFinal/reviewCount,
                        priceForTwo: restaurant.priceForTwo,
                        images: restaurant.images[0], 
                        reviewsCount: reviewCount
                    })
                })

                res.json(responseRestaurants)
            }
        })
        break;
    }
})

/************************* Food API */
// app.get('/api/public/library/food/', function(req, res){
//     var queryType = req.query.queryType
//     switch(queryType){
//         case "popular":
//             break;
//     }
// })

/******** Food API End */


/************* Analytics API */
app.post('/api/secure/analytics/restaurant', function(req, res){
    var requestType = req.body.analyticType //1. Restaurant 2. Food 
    var requestDest = req.body.destinationID
    var analyticDestType = req.body.analyticDestType
    var analyticTime = new Date()
    if(analyticDestType == 1){
        restaurants.find({"_id": requestDest}, function(resErr, resResp){
            if(resErr){
                res.status(500)
                res.json(generateInternalServerError())
            } else if(resResp) {
                analytic.findOne({"destinationID": requestDest}, function(anaErr, anaResp){
                    if(anaErr){
                        console.log(anaErr)
                        res.status(500)
                        res.json(generateInternalServerError())
                    } else if(anaResp){
                        switch(requestType){
                            case 1:
                                anaResp.update({
                                    $push: {
                                        "clicks": analyticTime
                                    }
                                }, function(updateErr, updateResp){
                                    res.send("Ok")
                                })
                                break;
                            case 2:
                                anaResp.update({
                                    $push: {
                                        "inorders": analyticTime
                                    }
                                }, function(updateErr, updateResp){
                                    res.send("Ok")
                                })
                                break;
                            case 3:
                                anaResp.update({
                                    $push: {
                                        "bookings": analyticTime
                                    }
                                }, function(updateErr, updateResp){
                                    res.send("Ok")
                                })
                                break;
                            case 4:
                                anaResp.update({
                                    $push: {
                                        "ratingReviews": analyticTime
                                    }
                                }, function(updateErr, updateResp){
                                    res.send("Ok")
                                })
                                break;
                            case 5:
                                anaResp.update({
                                    $push: {
                                        "scans": analyticTime
                                    }
                                }, function(updateErr, updateResp){
                                    if(updateErr){
                                        console.log(updateErr)
                                    }
                                    res.send("Ok")
                                })
                                break;
                        }
                    } else {
                        switch(requestType){
                            case 1:
                                analytic.create(new analytic({
                                    destinationID: requestDest,
                                    clicks: [analyticTime],
                                }))
                                res.send("Ok")
                                break;
                            case 2:
                                analytic.create(new analytic({
                                    destinationID: requestDest,
                                    inorders: [analyticTime],
                                }))
                                res.send("Ok")
                                break;
                            case 3:
                                analytic.create(new analytic({
                                    destinationID: requestDest,
                                    bookings: [analyticTime],
                                }))
                                res.send("Ok")
                                break;
                            case 4:
                                analytic.create(new analytic({
                                    destinationID: requestDest,
                                    ratingReviews: [analyticTime],
                                }))
                                res.send("Ok")
                                break;
                            case 5:
                                analytic.create(new analytic({
                                    destinationID: requestDest,
                                    scans: [analyticTime],
                                }))
                                res.send("Ok")
                                break;
                        }
                    }
                })
            } else {
                res.status(400)
                res.json({
                    "message": "Requested Analytics Destination not found. Bad Request",
                    "status": 400
                })
            }
        })
    }
})



/************ Ratings & Reviews API */
app.post('/api/secure/access/rating', isUserValid, function(req, res){
    var userDecryptionParams = DecryptForParams(req.headers["authorization"].substring(7, req.headers["authorization"].length-1))
    var destinationID = req.body.reviewDest
    var type = req.body.reviewType
    var priceSpent = req.body.priceSpent
    var dateTime = IndianTimeResponder()
    var uID = userDecryptionParams.identity
    ratingReviews.find({'uID': uID}).sort({"dateTime": -1}).exec(function(rErr, rResp){
        var currentNewDate, plus3DateTime
        if(rResp.length > 0){
            var date = new Date(rResp[0].dateTime)
            var currentNewDate = new Date(date).toLocaleString('en-GB', {
                timeZone: 'Asia/Kolkata', 
            })
            var plus3DateTime = new Date(date.setHours(date.getHours() + 3)).toLocaleString('en-GB', {
                timeZone: 'Asia/Kolkata', 
            })
        } else {
            currentNewDate = plus3DateTime = "No Document"
        }
        if(currentNewDate >= plus3DateTime){
                if(type == 1){
        var rating = req.body.ratingReview[0].rating
        var review = req.body.ratingReview[0].review
        ratingReviews.create(new ratingReviews({
            uID: uID,
            reviewDest: destinationID,
            type: type,
            rating: rating,
            review: review,
            dateTime: dateTime
        }), function(rInsertErr, rInsertResp){
            users.findOne({_id: uID}, function(findErr, findResp){
                if(findErr){
                    console.log(findErr)
                    res.status(500)
                    res.json(generateInternalServerError())
                } else if(findResp) {
                        wallet.findOne({"uID": uID},function(wallErr, wallResp){
                            if(wallErr){
                                console.log(wallErr)
                                res.status(500)
                                res.json(generateInternalServerError())
                            } else if(wallResp) {
                                var transactionID = GenerateRandomID(12)
                                while(wallResp.history.indexOf(transactionID) != -1){
                                    transactionID = GenerateRandomID(12)
                                }
                                var transactionType = "CREDIT"
                                var transactionAmount = 10;
                                if(type == 2){
                                    if(priceSpent != undefined){
                                        transactionAmount += Math.floor(0.02 * priceSpent)
                                    }
                                }
                                /***************** requires modification */
                                var transactionMessage = "Reward of "+ transactionAmount +" Points for Rating and Reviewing the food of so & so restaurant"
                                if(type == 1){
                                    transactionAmount = 20
                                    restaurants.findOne({'_id': destinationID}, function(resErr, resResp){
                                        transactionMessage = "Reward of 20 points for Rating & Reviewing " + resResp.name
                                    })
                                }
                                var transactionTime = IndianTimeResponder()
                                var ip = req.connection.remoteAddress
                                transaction.create(new transaction({
                                    transactionID: transactionID,
                                    purpose: transactionMessage,
                                    type: transactionType,
                                    dateTime: transactionTime,
                                    amount: transactionAmount,
                                    ip: ip
                                }), function(traErr, traResp){
                                    wallet.updateOne({ '_id': wallResp._id }, { 
                                        $set: {
                                        "walletPoints": walletPointsDecider(wallResp.walletPoints, transactionType, findResp.isPremium, transactionAmount),
                                        "lastTransactionTime": transactionTime
                                    }, $push: {"history": traResp.transactionID }
                                    },function(creErr, creResp){
                                        res.send({
                                            uID: uID,
                                            reviewDest: destinationID,
                                            type: type,
                                            rating: rating,
                                            review: review,
                                            dateTime: dateTime
                                        })
                                    })
                                })
                            }
                        })
                }
            })
        })

    } else if(type == 2){
        var requestRatings = req.body.ratingReview
        var i=0;
        for(i=0;i<requestRatings.length;i++){
            ratingReviews.create(new ratingReviews({
                uID: uID,
                reviewDest: destinationID,
                type: type,
                rating: requestRatings[i].rating,
                review: requestRatings[i].review,
                dateTime: dateTime
            }))
        }
        users.findOne({_id: uID}, function(findErr, findResp){
                if(findErr){
                    console.log(findErr)
                    res.status(500)
                    res.json(generateInternalServerError())
                } else if(findResp) {
                    console.log("Hello")
                        wallet.findOne({"uID": uID},function(wallErr, wallResp){
                            if(wallErr){
                                console.log(wallErr)
                                res.status(500)
                                res.json(generateInternalServerError())
                            } else if(wallResp) {
                                var transactionID = GenerateRandomID(12)
                                while(wallResp.history.indexOf(transactionID) != -1){
                                    transactionID = GenerateRandomID(12)
                                }
                                var transactionType = "CREDIT"
                                var transactionAmount = 10;
                                /***************** requires modification */
                                var transactionMessage = "Reward of 10 Points for Rating and Reviewing the food of so & so restaurant"
                                if(type == 1){
                                    transactionAmount = 20
                                    restaurants.findOne({'_id': destinationID}, function(resErr, resResp){
                                        transactionMessage = "Reward of 20 points for Rating & Reviewing " + resResp.name
                                    })
                                }
                                var transactionTime = IndianTimeResponder()
                                var ip = req.connection.remoteAddress
                                transaction.create(new transaction({
                                    transactionID: transactionID,
                                    purpose: transactionMessage,
                                    type: transactionType,
                                    dateTime: transactionTime,
                                    amount: transactionAmount,
                                    ip: ip
                                }), function(traErr, traResp){
                                    wallet.updateOne({ '_id': wallResp._id }, { 
                                        $set: {
                                        "walletPoints": walletPointsDecider(wallResp.walletPoints, transactionType, findResp.isPremium, transactionAmount),
                                        "lastTransactionTime": transactionTime
                                    }, $push: {"history": traResp.transactionID }
                                    },function(creErr, creResp){
                                        res.send({
                                            uID: uID,
                                            reviewDest: destinationID,
                                            type: type,
                                            rating: rating,
                                            review: review,
                                            dateTime: dateTime
                                        })
                                    })
                                })
                            }
                        })
                }
            })
        }
        } else {
            res.status(403)
            res.json({
                "message": "You have already rated. Wait for next 3 hours to proceed",
                "status":403
            })
        }
    })

})

function isUserValid(req, res, next){
    return next()
}


function generateInternalServerError(){
    return {
        "message": "Internal Server Error",
        "status": 500
    }
}

function walletPointsDecider(currentWalletPoints, typeOfTransaction, isPremium, amount, price){
    var points = Number.parseFloat(currentWalletPoints)
    var newAmount = amount
    if(typeOfTransaction == "CREDIT"){
        if(isPremium){
            if(currentWalletPoints >= GOLD_TIER_WALLET_PRICE){
                newAmount = amount * 2.5 // 2.5 times Gold Tier & Premium
                points = (points + newAmount)
            } else if(GOLD_TIER_WALLET_PRICE > currentWalletPoints >= SILVER_TIER_WALLET_PRICE){
                newAmount = amount * 2 // 2 times Silver Tier & Premium
                points = (points + newAmount)
            } else {
                newAmount = amount * 1.5 // 1.5 times Bronze Tier & Premium
                points = (points + newAmount)
            } 
            return points
        } else {
            if(currentWalletPoints >= BRONZE_TIER_WALLET_PRICE){
                newAmount = amount * 1.2 // 1.2 times Bronze & Non Premium
                points = (points + newAmount)
            } else {
                newAmount = amount * 1.0 // Normal User no multiplier
                points = points + newAmount
            }
        }
        return points
    } else {
        points -= amount
        return points
    }
}

app.get('/api/tokenGenerator/inorder/:restaurantID', function(req, res){
    var accessTokenHeader = req.headers["authorization"]
    var accessToken = accessTokenHeader.substring(7, accessTokenHeader.length - 1)
    var accessTokenDecrypted = DecryptForParams(accessToken)
    res.send(accessTokenDecrypted)
})

function CheckAccessTokenValidiy(req, res, next){
    var accessTokenHeader = req.headers["authorization"]
    if(accessTokenHeader != undefined){
        var accessToken = accessTokenHeader.substring(7, accessTokenHeader.length)
    try {
        var accessTokenDecrypted = DecryptForParams(accessToken)
        var identity = accessTokenDecrypted.identity
        var expiry = accessTokenDecrypted.expiry
        users.findOne({"_id": identity}, function(usrErr, usrResp){
            if(usrErr){
                res.status(500)
                res.json(generateInternalServerError())
            } else if(usrResp) {
                var date = IndianTimeResponder()
                expiry = new Date(expiry)
                console.log(expiry)
                if(date < expiry){
                    oauth.findOne({ "refID": accessTokenDecrypted.identity }, function(findErr, findResp){
                        if(findErr){
                            res.status(500)
                            res.json(generateInternalServerError())
                        } else if(findResp.accessToken == accessToken){
                            return next()
                        } else {
                            res.status(301)
                            res.send({
                                "accessToken": findResp.accessToken,
                                "status": 301
                            })
                        }
                    })
                } else {
                    console
                    oauth.findOne({ "accessToken": accessToken }, function(foundErr, foundRes){
                        if(foundErr){
                            res.status(500)
                            res.json(generateInternalServerError())
                        } else if(!foundRes){
                            res.status(401)
                            res.json({
                                "message": "You are unauthorized to access this page",
                                "status": 401
                            })
                        } else {
                            var refIdentity = foundRes.refID;
                            if(accessTokenDecrypted.identity == refIdentity){
                                var refreshToken = foundRes.refreshToken
                                try{
                                    var refreshTokenDecrypted = DecryptForBookingsParams(refreshToken)
                                    var refExpiry = refreshTokenDecrypted.expiry
                                    refExpiry = new Date(refExpiry)
                                    console.log(refExpiry)
                                    console.log(date)
                                    if(date < refExpiry){
                                        var accessTokenPayload = {
                                            "usageType": TokenUsageTypes.ACCESS,
                                            "issuer": "Mazon",
                                            "identity": foundRes.refID,
                                            "expiry": ExpiryTimeGenerator(45*24*60*60*1000)
                                        }
                                        var accessTokenNew = encrypt(JSON.stringify(accessTokenPayload))
                                        accessTokenNew += '.' + EncodeStringtoHex((foundRes.refID).toString())
                                        console.log(refIdentity)
                                        oauth.updateOne({"refID" : refIdentity }, { $set : {
                                            "accessToken" : accessTokenNew
                                        }
                                    }, function(updateErr, updateResp){
                                            if(updateErr){
                                                res.status(500)
                                                res.json(generateInternalServerError())
                                            } else if(updateResp) {
                                                res.json({
                                                    "accessToken" : accessTokenNew,
                                                    "status": 204
                                                })
                                            }
                                        })
                                    } else {
                                        res.status(400)
                                        res.json({
                                            "status": 400,
                                            "message": "Bad Request. Tokens Expired"
                                        })
                                    }
                                } catch(err){
                                    console.log(err)
                                    res.status(400)
                                    res.json({
                                        "status": 400,
                                        "message": "Bad Request. Invalid Token"
                                    })
                                }
                            } else {
                                res.status(401)
                                res.json({
                                    "status": 401,
                                    "message": "You are unauthorized to perform this request"
                                })
                            }
                        }
                    })
                }
            } else {
                res.status(404)
                res.send({
                    "message": "Requested Token is invalid",
                    "status": 404
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400)
        res.json({
            "message": "Invalid Token. Bad Request",
            "status": 400
        })
    }
} else {
        res.status(401)
        res.json({
            "message": "Unauthorized",
            "status": 401
        })
}
    
}


app.get('/api/library/food/', function(req, res){
    var queryType = req.query.queryType
    var responseFood = []
    switch(queryType){
        case "popular":
            food.find({ "popularity": {
                $gte : 8
            }}).limit(15).sort({"popularity": -1}).exec(function(fErr, fResp){
                if(fErr){
                    console.log(fErr)
                    res.status(500)
                    res.json(generateInternalServerError())
                }else if(fResp){
                    fResp.forEach(food => {
                        var currentRating = 0;
                        var currentReviews = 0;
                        var restaurantID;
                        var restaurantName;
                        restaurants.findOne({"_id": food.rId}, function(frErr, frResp){
                            restaurantName = frResp.name
                        })
                        ratingReviews.find({ "reviewDest":food._id }, function(rErr, rRes){
                            currentReviews = rRes.length
                            rRes.forEach(rating => {
                                currentRating += Number.parseFloat(rating.rating)
                            });
                        })
                        responseFood.push({
                            "name": food.fName,
                            "image": food.fImage,
                            "orders": food.orders,
                            "ratings": currentRating,
                            "reviews": currentReviews,
                            "restaurant": restaurantName
                        })
                    });
                    res.json(responseFood);
                }
            })
            break;
            case "featured":
            food.find({ "isFeatured": true }).limit(15).sort({"popularity": -1}).exec(function(fErr, fResp){
                if(fErr){
                    console.log(fErr)
                    res.status(500)
                    res.json(generateInternalServerError())
                }else if(fResp){
                    fResp.forEach(food => {
                        var currentRating = 0;
                        var currentReviews = 0;
                        var restaurantID;
                        var restaurantName;
                        restaurants.findOne({"_id": food.rId}, function(frErr, frResp){
                            restaurantID = frResp._id
                            restaurantName = frResp.name
                        })
                        ratingReviews.find({ "reviewDest":food._id }, function(rErr, rRes){
                            currentReviews = rRes.length
                            rRes.forEach(rating => {
                                currentRating += Number.parseFloat(rating.rating)
                            });
                        })
                        responseFood.push({
                            "name": food.fName,
                            "image": food.fImage,
                            "orders": food.orders,
                            "ratings": currentRating,
                            "reviews": currentReviews,
                            "restaurant": restaurantName,
                            "restaurantID": restaurantID
                        })
                    });
                    res.json(responseFood);
                }
            })
            break;
    }
})

app.post('/api/secure/bookings/party/:restaurantID', CheckAccessTokenValidiy, function(req, res){
    var restaurantID = req.params.restaurantID
})

app.post('/api/generateOrderCredentials/:restaurantID/:tableNo', CheckAccessTokenValidiy, function(req, res){
    var restaurantID = req.params.restaurantID
    var tableNo = req.params.tableNo
    if(mongoose.Types.ObjectId.isValid(restaurantID)) {
        restaurants.findOne({ "_id": restaurantID }, function(resErr, resResp){
            if(resErr){
                console.log(resErr)
                res.json(generateInternalServerError())
            } else if(resResp){
                var accessTokenHeader = req.headers["authorization"]
                var accessToken = accessTokenHeader.substring(7, accessTokenHeader.length - 1)
                var accessParams = DecryptForBookingsParams(accessToken)
                users.findOne({'_id': accessParams.identity}, function(finErr, finResp){
                    if(finErr){

                    } else if(finResp){
                        var userEmail = finResp.email
                        inorder.findOne({'email': userEmail, 'isPaid': false}, function(menErr, menResp){
                            if(menErr){

                            } else if(menResp){
                                res.status(403)
                                res.json({
                                    "status": 403,
                                    "orderid": menResp.orderRefID,
                                    "orderToken": menResp.orderToken,
                                    "orderType": 2 /* 1) New Order 2) Pending Order */,
                                    "identity": userEmail,
                                    "restaurant": menResp.rId,
                                    "table": menResp.rTable
                                })
                            } else {
                                var inorderToken = InordersTokenGenerator(restaurantID, userEmail)
                                var randomID = GenerateRandomID(21)
                                while(checkForInorderID(randomID)){
                                    randomID = GenerateRandomID(21)
                                }
                                oauth.findOneAndUpdate({ "refIdentity": userEmail }, { $set : { "mazonInorderToken" : inorderToken } }, function(upErr, upResp){
                                    if(upResp){
                                        res.json({
                                            "status": 200,
                                            "orderid": randomID,
                                            "orderToken": inorderToken,
                                            "orderType": 2 /* 1) New Order 2) Pending Order */,
                                            "identity": userEmail,
                                            "restaurant": restaurantID,
                                            "table": tableNo
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                res.status(400)
                res.json({
                    "message": "Bad Request. Invalid Restaurant ID",
                    "status": 400
                })
            }
        })
    } else {
        res.status(400)
        res.json({
            "message": "Bad Request. Invalid Restaurant ID",
            "status": 400
        })
    }
})

function InordersTokenGenerator(restaurantID, email){
    let inorderRequestPayload = {
        "usageType": TokenUsageTypes.INORDER,
        "issuer": "Mazon",
        "identity": email,
        "requestFor": restaurantID,
        "expiry": ExpiryTimeGenerator(24*60*60*1000)
    }
    let cipher = crypto.createCipheriv('aes-128-ccm', Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(inorderRequestPayload));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function ExpiryTimeGenerator(expiry){
    return new Date(new Date().getTime() + (expiry))
}

function checkForInorderID(id){
    inorder.find({'orderRefID': id}, function(err, res){
        if(res){
            return false
        }
    })
}

app.get('/api/library/menu/:restaurantID', /*CheckAccessTokenValidiy,*/ (req, res)=>{
    try {
        var finalResults = async() => {
            var response = {
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
                "7": [],
                "8": [],
                "9": [],
                "10": [],
                "11": [],
                "12": [],
                "13": [],
                "14": [],
            }
        var restaurantID = req.params.restaurantID
        const menu = food.find({ 'rId': restaurantID})
        var findResp = await menu;
        console.log(findResp)
        if(findResp.length > 0){
            async function getRatings(foodID){
                try {
                    return await ratingReviews.find({ 'reviewDest': foodID}).exec()
                } catch(findERR) {
                    return findERR
                }
                }
                
                var i = 0;
                for(i=0; i<findResp.length; i++){
                food = findResp[i]
                const ratings = await getRatings(food._id)
                response[`${food.category}`].push({
                    "id": food._id,
                    "name": food.name,
                    "price": food.price,
                    "image": food.image,
                    "ratings": ratings,
                    "isFeatured": food.isFeatured,
                    "veg": food.veg
                })
            }
            return response
        }
    }
    finalResults().then(result => {
        res.json(result)
    }, (ress)=>console.log(ress)).catch(err => console.log(err))
} catch(errMain){
    throw "Error occured: " + errMain
}
})

// app.get('/api/library/menu/:restaurantID', /*CheckAccessTokenValidiy,*/ (req, res)=>{
//     var restaurantID = req.params.restaurantID;
//     food.find({'rId': restaurantID }, function(fiErr, fiRes){
//         if(fiErr){

//         } else if(fiRes.length > 0 ) {
//             ratingReviews.find({})
//         }
//     })
// })

/****************** Inorder API */
app.post('/api/secure/bookings/inorder/', CheckAccessTokenValidiy, function(req, res){
    var inorderRequestToken = req.headers["x-mazon-inorder-request-token"]
    var orderid = req.body.orderid
    var tableno = req.body.tableno
    var restaurant = req.body.restaurant
    var identity = req.body.identity
    var menu = req.body.menu
    var name = req.body.name
    var email = req.body.email
    var phone = req.body.phone
    var offer = req.body.offer
    var orderType = req.body.orderType
    oauth.findOne({ 'mazonInorderToken': inorderRequestToken }, function(fErr, fResp){
        if(fResp){
            try {
                var inorderparams = DecryptForBookingsParams(inorderRequestToken)
                if(inorderparams.identity == identity && inorderparams.usageType == 3 && IndianTimeResponder() < new Date(inorderparams.expiry)){
                    inorder.create(new inorder({
                        rId: restaurant,
                        rTable: tableno,
                        menu: menu,
                        orderDateTime: IndianTimeResponder(),
                        orderStatus: 1,
                        orderRefID: orderid,
                        orderType: orderType,
                        orderToken: inorderRequestToken,
                        offerApplied: offer,
                        paymentMode: "None",
                        isPaid: false,
                        name: name,
                        phone: phone,
                        email: email
                    }))
                    //TODO: Execute the function of sending the notifications
                    // That is push notifications
                    //from google cloud platform
                    
                }
            } catch (error) {
                
            }
        } else {
            res.status(403)
            res.json({
                "message": "Forbidden. Invalid or Expired API Token",
                "status": 403
            })
        }
    })
})

async function getRatingsReviews() {
    try {
        const result = await ratingReviews.find({}).exec();
        return result;
    }
    catch {
        return false;
    }
}

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

app.listen(9000, function(){
    console.log("Server started at localhost & listening on 9000");
  });