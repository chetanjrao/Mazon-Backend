const {
    get_waiter_by_id,
    get_waiters_by_restaurant,
    create_waiter,
    disable_waiter,
    get_inorders,
    update_waiter,
    get_waiter_by_user_id,
    get_waiter_with_strict_rules
} = require('../services/waiter.service')
const {
    check_restaurant
} = require('../services/restaurant.service')
const AccessToken = require('../models/accesstoken.model')
const RefreshToken = require('../models/refreshtoken.model')
const bcrypt = require('bcrypt')
const Users = require('../models/user.model')
const {
    get_user_details_by_email_or_mobile,
    create_mobile_otp,
    create_email_verification
} = require('../services/user.service')

const login_waiter = async (req, res, next) => {
    var authroizationHeader = req.headers["authorization"];
    var base64AuthData = authroizationHeader.substring(6)
    var authorizationArray = decodeBase64toString(base64AuthData)
    var authorization_split = authorizationArray.split(":")
    var email = authorization_split[0]
    var password = authorization_split[1]
    var device_id = req.body["device_id"]
    const user = await Users.findOne({
        'email': {
            $in: [email]
        }
    })
    if(user != null){
            var hashedPassword = user["password"]
            if(bcrypt.compareSync(password, hashedPassword)){
                    const access_tokens = await AccessToken.find({
                        "username": email
                    }).sort({
                        "created_at": -1
                    })
                    const refresh_tokens = await RefreshToken.find({
                        "username": email
                    }).sort({
                        "created_at": -1
                    })
                    const current_access_token = access_tokens[0]["access_token"]
                    const current_refresh_token = refresh_tokens[0]["refresh_token"]
                    const WaiterCheck = await get_waiter_by_user_id(user["_id"])
                    if(WaiterCheck != null){
                        if(user["device_id"].indexOf(device_id) === -1){
                            await user.updateOne({
                                $push: {
                                    device_id: device_id
                                }
                            })
                        }
                        res.json({
                            "message": "Logged in successfully as " + user["first_name"],
                            "status": 200,
                            "restaurant_id": WaiterCheck["restaurant"],
                            "access_token": current_access_token,
                            "refresh_token": current_refresh_token
                        })
                    } else {
                        res.status(401)
                        res.json({
                            "status": 401,
                            "message": "Invalid Username or Password"
                        })
                    }
             } else {
                    res.status(401)
                    res.json({
                        "status": 401,
                        "message": "Invalid Username or Password"
                    })
            }
        }else {
            res.status(401)
                res.json({
                    "status": 401,
                    "message": "Invalid Username or Password"
                })
        }
}

const signup = async (req, res, next) => { 
        const name = req.body["name"]
        const email = req.body["email"]
        const password = req.body["password"]
        const mobile = req.body["mobile"]
        const device_id = req.body["device_id"]
        const latitude = req.body["latitude"]
        const longitude = req.body["longitude"]
        const restaurant = req.body["restaurant"]
        const requesting_client = req.headers["user-agent"]
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const encrypted_password = bcrypt.hashSync(password, 10) 
        const current_user_check = await get_user_details_by_email_or_mobile(email, mobile)
        if(current_user_check == null){
            const new_user_document = new Users({
                first_name: name,
                email: email,
                password: encrypted_password,
                mobile: mobile,
                device_id: [device_id]
            })
            const new_user = await new_user_document.save()
            if(new_user != null){
                const mobile_otp = create_mobile_otp(new_user["_id"], mobile, "verification")
                // TODO: Send otp here
                const email_verification = await create_email_verification(email, new_user["_id"])
                const waiter_creation = await create_waiter(new_user["_id"], restaurant)
                // TODO: Send Email about verification Token
                // const new_wallet = await create_wallet(new_user["_id"], ip, latitude, longitude, requesting_client)
                // const wallet_access_token_creation = create_wallet_access_token(new_user["_id"], new_wallet["_id"])
                if(email_verification != null && waiter_creation != null){
                    res.json({
                        "message": "Waiter registered successfully. Verification link sent to email. Restaurant verification pending",
                        "status": 200
                    })
                } else {
                    res.json({
                        "message": "User registered successfully. Couldn't send verification link",
                        "status": 200
                    })
                }
                //TODO: perform series of oauth 2.0 and wallet generation methods
            } else {
                res.json({
                    "message": "Unable to create user",
                    "status": 500
                })
            }
        } else {
            res.status(403)
            res.json({
                "message": "Mobile or Email Address already exists",
                "status": 403
            })
        }
    }

const check_waiter_middleware = async (req, res, next) => {
    const user = res.locals["user_id"]
    const restaurant = req.body["restaurant_id"]
    const WaiterCheck = await get_waiter_with_strict_rules(user, restaurant)
    if(WaiterCheck != null){
        res.locals["is_waiter"] = true
        next()
    } else {
        res.status(401)
        res.json({
            "status": 401,
            "message": "Invalid Username or Password"
        })
    }
}

const waiter_inorders = async (req, res, next) => {
    const user = res.locals["user_id"]
    const restaurant_id = req.body["restaurant_id"]
    const inorders = await get_inorders(restaurant_id, user)
    res.json(inorders)
}


function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}


module.exports = {
    login_waiter,
    signup,
    check_waiter_middleware,
    waiter_inorders
}