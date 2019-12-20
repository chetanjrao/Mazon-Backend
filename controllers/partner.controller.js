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
const AccessToken = require('../models/AccessToken');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcrypt');
const Users = require('../models/User');
const {
    get_user_details_by_email_or_mobile,
    create_mobile_otp,
    create_email_verification
} = require('../services/user.service')

const login_partner = async (req, res, next) => {
    var authroizationHeader = req.headers["authorization"];
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
                const partner_creation = await create_partner(new_user["_id"], restaurant)
                // TODO: Send Email about verification Token
                // const new_wallet = await create_wallet(new_user["_id"], ip, latitude, longitude, requesting_client)
                // const wallet_access_token_creation = create_wallet_access_token(new_user["_id"], new_wallet["_id"])
                if(email_verification != null && partner_creation != null){
                    res.json({
                        "message": "Partner registered successfully. Verification link sent to email. Restaurant verification pending",
                        "status": 200
                    })
                } else {
                    res.json({
                        "message": "User registered successfully. Couldn't send verification link",
                        "status": 200
                    })
                }
                //TODO: perform series of oauth 2.0 and wallet generation methods
            }
        } else {
            res.status(403)
            res.json({
                "message": "Mobile or Email Address already exists",
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


module.exports = {
    login_partner,
    signup,
    confirm_partner_controller,
    check_partner_middleware,
    restaurant_inorders,
    get_order_summary,
    restaurant_inorders_specific
}