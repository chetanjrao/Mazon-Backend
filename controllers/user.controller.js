/*
 * Created on Sun Sep 08 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */

const Users = require('../models/user.model')
const ERROR_CODES = require('../helpers/constants.helper')
const OTP_SCOPES = require('../helpers/scopes.helper')
const msg91 = require('msg91-node-v2')
const MSG91 = new msg91("213839A7aBh3zS5aec5fc4")
const multer = require('multer')
const Feedback = require('../models/feedback.model')
const FoodRating = require('../models/foodrating.model')
const RestaurantRating = require('../models/restaurantrating.model')
const Restaurant = require('../models/restaurant.model')
const Inorder = require('../models/inorder.model')
const Booking = require('../models/booking.model')
const Trending = require('../models/trending.model')
const Tier = require('../models/tier.model')
const Claim = require('../models/claims.model')
const {
    create_transaction
} = require('../services/transaction.service')
const {
    credit_points_to_wallet,
    get_wallet_details
} = require('../services/wallet.service')
const {
    create_trending,
    push_reports
} = require('../services/trending.service')
const {
    storage
} = require('../helpers/utils.helper')

const {
    generate_alphanumeric_otp
} = require('../services/utils.service')
const {
    create_otp,
    validate_otp,
    invalidate_otp
} = require('../services/otp.service')
const {
    mailer
} = require('../helpers/utils.helper')
const {
    create_accesstoken,
    validate_accesstoken,
    revoke_accesstokens
} = require('../services/accesstoken.service')
const {
    create_refreshtoken,
    validate_refreshtoken,
    revoke_refreshtokens
} = require('../services/refereshtoken.service')
const {
    get_offer_details,
    check_offer
} = require('../services/offer.service')
const {
    get_complete_profile
} = require('../services/user.service')
const {
    get_all_transactions
} = require('../services/transaction.service')
const {
    get_wallet_based_user
} = require('../services/wallet.service')
const hbs = require('nodemailer-express-handlebars')
const {
    sendNotificationToDevices
} = require('../helpers/firebase.helper')
const DishSuggestion = require('../models/dishsuggestion.model')

mailer.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: './views/',
        layoutsDir: './views/',
        defaultLayout: 'otp.handlebars'
    },
    viewPath: './views/'
}))

const {
    OAuth2Client
} = require('google-auth-library')
const GOOGLE_OAUTH_CLIENT = new OAuth2Client()
const {
    get_user_details_by_email,
    get_user_details_by_email_or_mobile,
    get_user_strict
} = require('../services/user.service')
const {
    create_wallet,
} = require('../services/wallet.service')
const {
    create_passkey,
    validate_passkey,
    invalidate_passkey
} = require('../services/passkey.service')

module.exports = {
    signup: async (req, res, next)=>{
        const name = req.body["name"]
        const email = req.body["email"]
        const mobile = req.body["mobile"]
        const device_id = req.body["device_id"]
        const split_name = name.split(" ")
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        var first_name = "";
        var last_name = "";
        for(var i=0;i<split_name.length-1;i++){
            first_name += split_name[i] + " "
        } 
        last_name = split_name[split_name.length-1]
        const current_user_check = await get_user_details_by_email_or_mobile(email, mobile)
        if(current_user_check == null){
            const new_user_document = new Users({
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile: mobile,
                device_id: [device_id]
            })
            try{
                const new_user = await new_user_document.save()
                const otp = generate_alphanumeric_otp(6)
                await create_otp(otp, email, OTP_SCOPES.SIGNUP);
                const mail = {
                    from: "no-reply@mazonapp.com",
                    to: email,
                    subject: "Login to Mazon | Mazon Technologies Pvt. Ltd.",
                    template: "otp",
                    context: {
                        user: first_name,
                        otp: otp
                    }
                }
                mailer.sendMail(mail)
                create_wallet(new_user["_id"], ip, user_agent)
                res.json({
                    "message": "OTP sent to your registered email address",
                    "status": 200
                })
            } catch(REGISTRATION_FAILURE) {
                console.log(REGISTRATION_FAILURE)
                res.status(500)
                res.json({
                    "message": "Internal Server Error",
                    "status": 500,
                    "error_code": ERROR_CODES.REGISTRATION_ERROR
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Mobile or Email Address already exists",
                "status": 403,
                "error_code": ERROR_CODES.DOCUMENT_EXISTS
            })
        }
        
    },
    signinwithgoogle: async (req, res, next) => {
        const idtoken = req.body["id_token"]
        
    },
    token_middleware: async (req, res, next) => {
        try {
            const request_header = req.headers["authorization"]
            const scope = req.body["scope"]
            try{
            const split_header = request_header.split(" ", 2)
            if(split_header[0] == "Bearer"){
                try{
                    const access_token = split_header[1].trim()
                    const access_token_document = await AccessToken.findOne({
                        "access_token": access_token
                    })
                    if(access_token_document != null){
                        const now = new Date()
                        const expiry = access_token_document["expiry"]
                        if(now < expiry){
                            if(access_token_document["scopes"].indexOf(scope) === -1){
                                res.status(403)
                                res.json({
                                    "message": "Forbidden",
                                    "status": 403,
                                    "error_code": ERROR_CODES.INVALID_SCOPE
                                })
                            } else {
                                res.locals["user_id"] = access_token_document["user"]
                                const current_user = await get_user_strict(access_token_document["user"])
                                res.locals["user"] = current_user["email"]
                                next()
                            }
                        } else {
                            res.status(401)
                            res.json({
                                "message": "Tokens expired",
                                "status": 401,
                                "error_code": ERROR_CODES.TOKENS_EXPIRED
                            })
                        }
                    } else {
                        res.status(403)
                        res.json({
                            "message": "Forbidden",
                            "status": 403,
                            "error_code": ERROR_CODES.TOKEN_MISSING
                        })
                    }
                } catch(e) {
                    console.log(e)
                    res.status(403)
                    res.json({
                        "message": "Forbidden",
                        "status": 403
                    })
                }
            } else {
                res.status(403)
                res.json({
                    "message": "Forbidden",
                    "status": 403
                })
            } 
        } catch (HEADER_MISSING){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
        } catch (error) {
            console.log(error)
            res.status(403)
            res.json({
                "message": "Forbidden",
                "status": 403
            })
        }
        
    },
    sendotp: async (req, res, next) => {
        const email = req.body["email"]
        const user = await get_user_details_by_email(email)
        if(user != null){
            const otp = generate_alphanumeric_otp(6)
            await create_otp(otp, email, OTP_SCOPES.SIGNIN)
            const mail = {
                from: "no-reply@mazonapp.com",
                to: email,
                subject: "Login to Mazon | Mazon Technologies Pvt. Ltd.",
                template: "otp",
                context: {
                    user: user["first_name"],
                    otp: otp
                }
            }
            mailer.sendMail(mail)
            res.json({
                "message": "OTP has been sent to your email address",
                "status": 200
            })
        } else {
            res.status(403)
            res.json({
                "message": "User not found",
                "status": 403,
                "error_code": ERROR_CODES.DOCUMENT_NOT_FOUND
            })
        }
    },
    verifyotp: async (req, res, next) => {
        const otp = req.body["otp"]
        const scope = req.body["scope"]
        const grant = req.body["grant"]
        const device_id = req.body["device_id"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const is_valid_otp = await validate_otp(grant, otp, scope)
        if(is_valid_otp){
            const user = await get_user_details_by_email(grant)
            await invalidate_otp(grant, otp, scope)
            await user.updateOne({
                $addToSet: {
                    "device_id": device_id
                }
            })
            const passkey = await create_passkey(grant, "email", grant, ip, user_agent)
            if(passkey != null){
                res.json({
                    "message": "Logged in succesfully",
                    "first_name": user["first_name"],
                    "user_id": user["_id"],
                    "mobile": user["mobile"],
                    "passkey": passkey["passkey"],
                    "status": 200
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Invalid OTP",
                "status": 403
            })
        }
    },
    token: async (req, res, next) => {
        const passkey = req.headers["x-mazon-passkey"]
        const email = req.headers["x-mazon-user"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const validate_key = await validate_passkey(passkey, email)
        if(validate_key){
            await invalidate_passkey(passkey, email)
            const access_token = await create_accesstoken(email, user_agent, ip)
            const refresh_token = await create_refreshtoken(email, user_agent, ip)
            res.json({
                "access_token": access_token["access_token"],
                "refresh_token": refresh_token["refresh_token"],
                "message": "Tokens generated successfully",
                "status": 200
            })
        }else {
            res.status(401)
            res.json({
                "message": "Invalid passkey",
                "status": 401
            })
        }
    },
    validate_token: async(req, res, next)=>{
        const header = req.headers["authorization"]
        const user = req.headers["x-mazon-user"]
        const split = header.split(" ", 2)
        if(split[0] == "Bearer"){
            const is_token_valid = await validate_accesstoken(split[1], user)
            if(is_token_valid){
                const user_details = await get_user_details_by_email(user)
                if(user_details != null){
                    res.locals["user"] = user
                    res.locals["user_id"] = user_details["_id"]
                    next()
                } else {
                    res.status(403)
                    res.json({
                        "message": "Forbidden",
                        "status": 403
                    })
                }
            } else {
                res.status(401)
                res.json({
                    "message": "Invalid Credentials",
                    "status": 401
                })
            }
        } else {
            res.status(401)
            res.json({
                "message": "Invalid Credentials",
                "status": 401
            })
        }
    },
    check_offer: async (req, res, next) => {
        const user = req.headers["x-mazon-user"]
        const user_document = await get_user_details_by_email(user)
        const offer_code = req.query["offer_code"]
        const restaurant_id = req.query["restaurant"]
        const offer_details = await get_offer_details(offer_code)
        const user_avails = 0;
        if(offer_details != null){
            for(var i=0;i<user_document["offers_availed"].length;i++){
                if(user_document["offers_availed"][i] == offer_code){
                    user_avails += 1
                }
            }
            if(user_avails < offer_details["max_user_avails"]){
                const check_offer_validity = await check_offer(restaurant_id, offer_code)
                if(check_offer_validity){
                    res.json({
                        "message": "Valid coupon",
                        "description": offer_details["description"]
                    })
                }else {
                    res.status(403)
                    res.json({
                        "message": "Invalid Offer Code",
                        "status": 403
                    })
                }
            }
        } else {
            res.status(403)
            res.json({
                "message": "Invalid Offer Code",
                "status": 403
            })
        }
    },
    check_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        if(user["is_mobile_verified"]){
            res.send("true")
        } else {
            res.status(403)
            res.send("false")
        }
    },
    send_otp_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        const otp = generate_alphanumeric_otp(6)
        await create_otp(otp, user["mobile"], OTP_SCOPES.MOBILE_VERIFICATION)
        let otps = {
            "sender": "MAZONT",
            "route": "4",
            "country": "91",
            sms: [
                {
                    "message": `Hi, ${user["first_name"]}. Your OTP (One Time Password) is ${otp}. This otp can only be used once and is valid for 15 mins only.`,
                    to: [`${user["mobile"]}`]
                }
            ]
        }
        MSG91.send(otps).then((data)=>{
            console.log(data)
        })
        res.send("ok")
    },
    verify_mobile: async (req, res, next) => {
        const email = res.locals["user"]
        const user = await get_user_details_by_email(email)
        const otp = req.body["otp"]
        const scope = req.body["scope"]
        const grant = req.body["grant"]
        const is_valid_otp = await validate_otp(grant, otp, scope)
        if(is_valid_otp){
            await invalidate_otp(grant, otp, scope)
            await user.updateOne({
                $set: {
                    "is_mobile_verified": true,
                    "updated_at": new Date(),
                    "updated_by": user["_id"]
                }
            })
            res.send("ok")
        } else {
            res.status(401)
            res.json({
                "message": "Invalid OTP",
                "status": 401
            })
        }
    },
    create_trending_con: async (req, res, next) => {
        const created_by = res.locals["user_id"]
        const email = res.locals["user"]
        const uploader = multer({
            storage: storage
        }).array("images[]")
        let images = []
        const now = new Date()
        now.setDate(now.getDate() - 1)
        const prev = new Date(now)
        const check = await Trending.find({
            $or: [
                {
                    "created_by": created_by,
                    "created_at": {
                        $gte: prev
                    }
                }
            ]
        })
        if(check.length < 3){
        uploader(req, res, async function(err){
        const dish_id = req.body["dish_id"]
        const restaurant_id = req.body["restaurant_id"]
        const latitude = req.body["latitude"]
        const longitude = req.body["longitude"]
        const contact = req.body["contact"]
        const rating = req.body["rating"]
        const review = req.body["review"]
        const restaurant_name = req.body["restaurant_name"]
        const dish_name = req.body["dish_name"]
        const isVeg = req.body["isVeg"]
        const address = req.body["address"]
        for(let i=0;i<req.files.length;i++){
            images.push(req.files[i]["path"])
        }
        if(dish_id == undefined){
            const dish_check = await Dish.findOne({
                "name": dish_name
            })
            if(dish_check == null){
                let slug = ""
                let split = dish_name.split(' ')
                for(let i=0;i<split.length;i++){
                    slug += split[i].toLowerCase()
                }
                const new_dish_document = new DishSuggestion({
                    name: dish_name,
                    images: images,
                    slug: slug,
                    isVeg: isVeg,
                    created_by: created_by
                })
                await new_dish_document.save()
            }
        }
        // if(dish_id != undefined){
        //     await Dish.findOneAndUpdate({
        //         "_id": current_dish_id
        //     }, {
        //         $push: {
        //             images: images
        //         }
        //     })
        // }
        // await Menu.findOneAndUpdate({
        //     "dish_id": current_dish_id,
        //     "rId": current_restaurant_id
        // }, {
        //     $push: {
        //         images: images
        //     }
        // })
        if(restaurant_id == undefined){
            const restaurant_check = await Suggestion.findOne({
                "name": restaurant_name
            })
            if(restaurant_check == null){
                await create_suggestion(restaurant_name, Number.parseFloat(latitude), Number.parseFloat(longitude), contact, email, address)
            }
        }
        if(restaurant_id != undefined && dish_id != undefined ){
        const rating__ = await create_trending(dish_id, latitude, rating, review, longitude,created_by, email , restaurant_id, contact, restaurant_name, dish_name, isVeg, images, address)
        if(rating__ != null){
            res.send("ok")
        } else {
            res.status(201)
            res.json({
                "message": "You have already reviewed this dish",
                "status": 201
            })
        }
    } else {
        res.status(200)
        res.send("ok")
    }
        })
    } else {
        res.status(201)
        res.json({
            "message": "You have reviewed maximum dishes today",
            "status": 201
        })
    }
    },
    profile: async (req, res, next) => {
        const user = await get_complete_profile(res.locals["user"], res.locals["user_id"])
        res.json(user)
    },
    wallet: async (req, res, next) => {
        const user_id = res.locals["user_id"]
        const user = res.locals["user"]
        const wallet = await get_wallet_based_user(user_id)
        const transactions = await get_all_transactions(user_id)
        res.json({
            wallet,
            transactions
        })
    },
    report: async (req, res, next) => {
        const trending_id = req.body["trending_id"]
        const user = res.locals["user_id"].toString()
        const reason = req.body["report_reason"]
        const report = await push_reports(user, trending_id, reason)
        if(report != null){
            res.send("ok")
        } else {
            res.status(500)
            res.send("not ok")
        }
    },
    referral: async (req, res, next) => {
        const user = res.locals["user_id"]
        const referrer = req.body["referrer"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const user_document = await Users.findOne({
            "_id": user
        })
        if(user_document["referrer"] == ""){
            const referrer_document = await Users.findOne({
                "_id": referrer
            })
            if(referrer_document != null){
                await user_document.updateOne({
                    $set: {
                        "referrer": referrer
                    }
                })
                const wallet = await get_wallet_based_user(referrer)
                await create_transaction(wallet["_id"], `Referred ${user_document["first_name"]}`, 50, 1, ip,`${user_document["first_name"] + " " + (user["last_name"] != null ? user["last_name"] : "") }`,referrer,user_agent)
                const credit = await credit_points_to_wallet(referrer, 50)
                if(credit != null){
                    sendNotificationToDevices(referrer_document["device_id"], {
                        "notification": {
                            "title": "You just earned \u20b9 50",
                            "body": `Hello, ${referrer_document["first_name"]}. You just earned \u20B950 by referring ${user_document["first_name"]}`
                        },
                    })
                    res.send("ok")
                } else {
                    res.status(500)
                    res.send("false")
                }
            }
        } else {
            res.status(403)
            res.json({
                "status": 403,
                "message": "You have already been referred"
            })
        }
    },
    feedback: async (req, res, next) => {
        const like = req.body["like"]
        const improvement = req.body["improvement"]
        const new_feedback = new Feedback({
            user: res.locals["user"],
            like: like,
            improvement: improvement
        })
        try{
            await new_feedback.save()
            res.send("ok")
        }catch(FEEDBACK_ERROR){
            res.status(500)
            res.send("fail")
        }
    },
    tier: async (req, res, next) => {
        const user = res.locals["user"]
        const user_id = res.locals["user_id"]
        const food_ratings = await FoodRating.find({
            "email": user
        })
        const food_ratings_count = food_ratings.length
        const restaurant_ratings = await RestaurantRating.find({
            "email": user
        })
        const restaurant_ratings_count = restaurant_ratings.length
        const inorders = await Inorder.find({
            "email": user,
            "order_status": 4
        })
        const inorder_length = inorders.length
        const referral = await Users.find({
            "referrar": user_id
        })
        const referral_length = referral.length
        const booking = await Booking.find({
            "status": 4
        })
        const booking_count = booking.length
        const tier_claim = await Claim.find({
            "user": user_id
        })
        const tier_details = await Tier.findOne({
            "level": tier_claim+1
        })
        var is_claimable = false;
        if(food_ratings_count >= tier_details["food_ratings"] && restaurant_ratings_count >= tier_details["restaurant_ratings"] && inorder_length >= tier_details["inorders"] && booking_count >= tier_details["bookings"] && referral_length >= tier_details["referrals"]){
            is_claimable = true
        }
        res.json({
            "tier": tier_details,
            is_claimable: is_claimable,
            "achievements": {
                "food_ratings": food_ratings_count,
                "restaurant_ratings": restaurant_ratings_count,
                "inorders": inorder_length,
                "bookings": booking_count,
                "referrals": referral_length
            }
        })
    },

    claim: async (req, res, next) => {
        const tier = req.body["tier"]
        const user = res.locals["user"]
        const user_id = res.locals["user_id"]
        const user_agent = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const food_ratings = await FoodRating.find({
            "email": user
        })
        const food_ratings_count = food_ratings.length
        const restaurant_ratings = await RestaurantRating.find({
            "email": user
        })
        const restaurant_ratings_count = restaurant_ratings.length
        const inorders = await Inorder.find({
            "email": user,
            "order_status": 4
        })
        const inorder_length = inorders.length
        const referral = await Users.find({
            "referrar": user_id
        })
        const referral_length = referral.length
        const booking = await Booking.find({
            "status": 4
        })
        const booking_count = booking.length
        const tier_claim = await Claim.find({
            "user": user_id
        })
        const tier_details = await Tier.findOne({
            "_id": tier
        })
        var is_claimable = false;
        if(food_ratings_count >= tier_details["food_ratings"] && restaurant_ratings_count >= tier_details["restaurant_ratings"] && inorder_length >= tier_details["inorders"] && booking_count >= tier_details["bookings"] && referral_length >= tier_details["referrals"]){
            is_claimable = true
        }
        if(is_claimable){
            const wallet = await get_wallet_based_user(user_id)
            await create_transaction(wallet["_id"], "Completing Tier Tasks", tier_details["reward"], 1, ip, "Mazon Technologies Pvt. Ltd.", user_id, user_agent)
            await credit_points_to_wallet(user_id, tier_details["reward"])
            const new_claim = new Claim({
                tier: tier,
                user: user_id
            })
            await new_claim.save()
            res.send("ok")
        } else {
            res.status(403)
            res.json({
                "message": "Kindly complete all tasks before claiming",
                "status": 403
            })
        }
    },
    rating_con: async (req, res, next) => {
        const uploader = multer({
            storage: storage
        }).array("images[]")
        let images = []
        const created_by = res.locals["user_id"]
        const email = res.locals["user"]
        uploader(req, res, async function(err){
            if(req.files != undefined){
                for(let i=0;i<req.files.length;i++){
                    images.push(req.files[i]["path"])
                }
            }
            const rating = req.body["rating"]
            const review = req.body["review"]
            const restaurant = req.body["restaurant"]
            const hygiene = req.body["hygiene"]
            const ambience = req.body["ambience"]
            const check = await RestaurantRating.findOne({
                //"user": created_by,
                "email": email
            })
            if(check == null){
                const new_rating = new RestaurantRating({
                    user: created_by,
                    email: email,
                    rating: rating,
                    review: review,
                    restaurant: restaurant,
                    ambience: ambience,
                    hygiene: hygiene
                })
                const new_ra = await new_rating.save()
                if(new_ra != null){
                    res.send("ok")
                }
            } else {
                res.status(403)
                res.send("You have already reviewed this restaurant")
            }
        })
    },
    edit: async(req, res, next) => {

    },
    inorders_conc: async (req, res, next) => {
        const user = res.locals["user"]
        const inorders = await Inorder.find({
            "email": user
        })
        const final = await Restaurant.populate(inorders, {
            "path": "rId",
            "select": "name"
        })
        res.json(final)
    },
    bookings_con: async (req, res, next) => {
        const user = res.locals["user"]
        const bookings = await Booking.find({
            "email": user
        })
        const final = await Restaurant.populate(bookings, {
            "path": "rId",
            "select": "name"
        })
        res.json(final)
    },
    get_ratings_con: async (req, res, next) => {
        const user = res.locals["user"]
        const ratings = await FoodRating.aggregate([
            {
                $match: {
                    email: user
                }
            },
            {
                $lookup: {
                    "from": "dishes",
                    "let": { "dish": {
                        $toObjectId: "$dish_id"
                    } },
                    "pipeline": [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$dish"]
                                }
                            }
                        },
                        {
                            $project: {
                                "name": "$name"
                            }
                        }
                    ],
                    as: "dish_data"
                }
            },
            {
                $lookup: {
                    "from": "restaurants",
                    "let": { "restaurant": {
                        $toObjectId: {
                            $trim: {
                                input: "$restaurant_id"}
                        }
                    } },
                    "pipeline": [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$restaurant"]
                                }
                            }
                        },
                        {
                            $project: {
                                "name": "$name"
                            }
                        }
                    ],
                    as: "restaurant_data"
                }
            }
        ])
        res.json(ratings)
    },
    upload: async (req, res, next) => {
        const uploader = multer({
            storage: storage
        }).array("image")
        const user = res.locals["user"]
        console.log(req.file)
        console.log(req.files)
        uploader(req, res, async function(err){
            await Users.findOneAndUpdate({
                "email": user
            }, {
                $set: {
                    image: req.files[0]["path"]
                }
            })
        })
    }
}

function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}
