const Waiter = require('../models/Waiter')
const WaiterVerificationToken = require('../models/WaiterVerificationToken')
const {
    mailer
} = require('../helpers/utils.helper')
const {
    generate_unique_identifier
} = require('./utils.service')
const {
    get_restaurant_owner_details
} = require('./restaurant.service')
const Inorders = require('../models/Inorder')
const crypto = require('crypto')

const RESTRICTED_PROJECTIONS = {
    "created_at": 0,
    "is_confirmed": 0,
    "is_deactivated": 0
}

const create_waiter = async (user_id, restaurant) => {
    const new_waiter_document = new Waiter({
        user: user_id,
        restaurant: restaurant
    })
    const current_restaurant = await get_restaurant_owner_details(restaurant)
    const new_waiter = await new_waiter_document.save()
    const randomToken = crypto.randomBytes(24).toString("hex")
    const waiter_verification_document = new WaiterVerificationToken({
        waiter: new_waiter["_id"],
        token: randomToken
    })
    const new_waiter_token_document = await waiter_verification_document.save()
    const restaurant_email = current_restaurant["email"]
    // mailer.sendMail({
    //     to: restaurant_email
    // })
    // TODO: Send email
    return new_waiter
}

const get_inorders = async (restaurant_id, waiter_id) => {
    const inorders = await Inorders.find({
        "created_by": waiter_id,
        "rId": restaurant_id,
        "is_paid": false
    }, {
        "device_id": 0,
        "menu": 0
    }).sort({"order_date_time": -1})
    return inorders
}

const disable_waiter = async (waiter_id, disabled_by)=>{
    const updated_waiter = await Waiter.findOneAndUpdate({
        "_id": waiter_id
    }, {
        $set: {
            "is_deactivated": {
                "is_deactivated": true,
                "deactivated_by": disabled_by,
                "deactivated_at": new Date()
            }
        }
    }, {
        new: true
    })
    return updated_waiter
}

const update_waiter = async (waiter_id, name , gender, address) => {
    const updated_waiter = await Waiter.findOneAndUpdate({
        "_id": waiter_id
    }, {
        $set: {
            "name": name,
            "gender": gender,
            "address": address 
        }
    }, {
        new: true
    })
    return updated_waiter
}

const get_waiter_by_id = async (waiter_id) => {
    const waiter = await Waiter.findOne({
        "_id": waiter_id,
        "is_confirmed.is_confirmed": true
    }, RESTRICTED_PROJECTIONS)
    return waiter
}
const get_waiter_by_user_id = async (user_id) => {
    const waiter = await Waiter.findOne({
        "user": user_id,
        "is_confirmed.is_confirmed": true
    })
    return waiter
}

const get_waiter_with_strict_rules = async (user_id, restaurant) => {
    const waiter = await Waiter.findOne({
        "user": user_id,
        "restaurant": restaurant,
        "is_deactivated.is_deactivated": false
    })
    return waiter
}

const get_waiters_by_restaurant = async (restaurant_id) => {
    const waiters = await Waiter.find({
        "restaurant": restaurant_id
    }, RESTRICTED_PROJECTIONS)
    return waiters
}

module.exports = {
    create_waiter,
    disable_waiter,
    update_waiter,
    get_waiter_by_id,
    get_waiters_by_restaurant,
    get_inorders,
    get_waiter_by_user_id,
    get_waiter_with_strict_rules
}