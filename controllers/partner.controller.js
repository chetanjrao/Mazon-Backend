const {
    create_partner,
    confim_partner,
    disable_partner,
    partner_details,
    get_partners,
    partner_details_specs,
    get_inorders
} = require('../services/partner.service');
const {
    check_restaurant,
    get_restaurant
} = require('../services/restaurant.service');
const {
    calculate_amount,
    place_inorder,
    finish_inorder,
    show_inorder,
    update_inorder,
    create_inorder_token,
    validate_inorder_token,
    get_active_inorder_with_email,
    get_inorders_with_restaurant,
    get_order_using_token_partner,
    get_overall_details,
    get_token_details,
    get_inorders_specific
} = require('../services/inorder.service')
const AccessToken = require('../models/accesstoken.model');
const RefreshToken = require('../models/refreshtoken.model');
const bcrypt = require('bcrypt');
const Users = require('../models/user.model');
const ERROR_CODES = require('../helpers/constants.helper')
const OTP_SCOPES = require('../helpers/scopes.helper')
const msg91 = require('msg91-node-v2')
const MSG91 = new msg91("213839A7aBh3zS5aec5fc4")
const multer = require('multer')
const {
    create_trending
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
const hbs = require('nodemailer-express-handlebars')
const {
    get_user_details_by_email_or_mobile,
    create_mobile_otp,
    create_email_verification
} = require('../services/user.service')
const {
    create_wallet,
} = require('../services/wallet.service')
const {
    create_passkey,
    validate_passkey,
    invalidate_passkey
} = require('../services/passkey.service')

const sendotp = async (req, res, next) => {
    const mobile = req.body["mobile"]
    const user = await get_user_details_by_email_or_mobile(mobile)
    if(user != null){
        const otp = generate_alphanumeric_otp(6)
        await create_otp(otp, email, OTP_SCOPES.PARTNER_LOGIN)
        let otps = {
            "sender": "MAZONT",
            "route": "4",
            "country": "91",
            sms: [
                {
                    "message": `Hi, ${user["first_name"]}. Your OTP (One Time Password) is ${otp}. This otp can only be used once and is valid for 15 mins only.`,
                    to: mobile
                }
            ]
        }
        await MSG91.send(otps)
        res.json({
            "message": "OTP has been sent to your mobile no",
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
}

const login_partner = async (req, res, next) => {
    var authroizationHeader = req.headers["authorization"];
    const device_id = req.body["device_id"]
    var base64AuthData = authroizationHeader.substring(6)
    var authorizationArray = decodeBase64toString(base64AuthData)
    var authorization_split = authorizationArray.split(":")
    var email = authorization_split[0]
    var password = authorization_split[1]
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
                    const restaurant = req.body["restaurant_id"]
                    const PartnerCheck = await partner_details_specs(user["_id"])
                    if(PartnerCheck != null){
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
                            "restaurant_id": PartnerCheck["restaurant"],
                            "access_token": current_access_token,
                            "refresh_token": current_refresh_token,
                            "_id": user["_id"]
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

const get_order_summary = async (req, res, next) => {
    const inorder_token = req.headers["x-mazon-token"]
    const user = req.body["email"]
    const reference = req.body["reference"]
    const token_document = await get_token_details(inorder_token, user)
    console.log(reference)
    const inorder_check = await get_order_using_token_partner(inorder_token, reference)
    const response = []
    var total_amount = 0;
    if(inorder_check.length > 0){
        for(var i=0;i<inorder_check.length;i++){
            const current_restaurant = inorder_check[i]["rId"]
            const items = inorder_check[i]["menu"]
            const current_inorder_details = await get_overall_details(current_restaurant, items)
            const order_id = inorder_check[i]["_id"]
            const placed_at = inorder_check[i]["order_date_time"]
            const restaurant_name = await get_restaurant(inorder_check[i]["rId"])
            const price = await calculate_amount(current_restaurant, items)
            total_amount += price;
            response.push({
                "restaurant_name": restaurant_name["name"],
                "items": current_inorder_details,
                "order_id": order_id,
                "name": inorder_check[i]["name"],
                "email": inorder_check[i]["email"],
                "phone": inorder_check[i]["phone"],
                "placed_at": placed_at,
                "table_no": inorder_check[i]["rTable"],
                "price": price
            })
        }
    }
    res.json({
        "total": total_amount,
        "offer_code": token_document["offer_code"],
        "orders": response
    })
}

const confirm_partner_controller = async (req, res, next) => {
    const user_id = res.locals["user_id"]
    const partner_id = req.body["partner_id"]
    const is_admin = res.locals["is_admin"]
    if(is_admin != null && is_admin == true){
        const update_partner = await confim_partner(partner_id, user_id)
        if(update_partner != null){
            res.json({
                "message": "Partner confirmed successfully",
                "status": 200
            })
        } else {
            res.status(500)
            res.json({
                "message": "Failed to confirm partner",
                "status": 500
            })
        }
    }
}

const signup = async (req, res, next) => { 
    const name = req.body["name"]
    const email = req.body["email"]
    const mobile = req.body["mobile"]
    const device_id = req.body["device_id"]
    const split_name = name.split(" ")
    var first_name = "";
    var last_name = "";
    for(var i=0;i<split_name.length-1;i++){
        first_name += split_name[i] + " "
    } 
    last_name = split_name[split_name.length-1]
    const current_user_check = await get_user_details_by_email_or_mobile(email, mobile)
    if(current_user_check["_id"] == undefined){
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
            create_wallet(new_user["_id"])
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
    }

const verifyotp = async (req, res, next) => {
    const otp = req.body["otp"]
    const scope = req.body["scope"]
    const grant = req.body["grant"]
    const user_agent = req.headers["user-agent"]
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const is_valid_otp = await validate_otp(grant, otp, scope)
    if(is_valid_otp){
        const user = await get_user_details_by_email(grant)
        await invalidate_otp(grant, otp, scope)
        const passkey = await create_passkey(grant, "mobile", grant, ip, user_agent)
        const partner = await partner_details_specs(user["_id"])
        if(passkey != null){
            res.json({
                "message": "Logged in succesfully",
                "first_name": user["first_name"],
                "user_id": user["_id"],
                "restaurant_id": partner["restaurant"],
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
}

const check_partner_middleware = async (req, res, next) => {
    const user = res.locals["user_id"]
    const restaurant = req.body["restaurant_id"]
    const PartnerCheck = await partner_details(user, restaurant)
    if(PartnerCheck != null){
        res.locals["is_partner"] = true
        next()
    } else {
        res.status(401)
        res.json({
            "status": 401,
            "message": "Invalid Username or Password"
        })
    }
}

const restaurant_inorders = async (req, res, next) => {
    const user = res.locals["user_id"]
    const restaurant_id = req.params["restaurantID"]
    const inorders = await get_inorders(restaurant_id)
    res.json(inorders)
}

const restaurant_inorders_specific = async (req, res, next) => {
    const user = res.locals["user_id"]
    const restaurant_id = req.params["restaurantID"]
    const status = req.body["order_status"]
    const inorders = await get_inorders_specific(restaurant_id, status)
    res.json(inorders)
}



function decodeBase64toString(string){
    return Buffer.from(string, 'base64').toString()
}

// const create_waiter_post_controller = async (req, res, next) => {
//     const user_creation = await create_u
// }

// const create_waiter_get_controller = async (req, res, next) => {
//     res.sendFile()
// }

module.exports = {
    login_partner,
    signup,
    confirm_partner_controller,
    check_partner_middleware,
    restaurant_inorders,
    get_order_summary,
    restaurant_inorders_specific
}