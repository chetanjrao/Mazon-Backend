const Waiter = require('../models/Waiter')
const RESTRICTED_PROJECTIONS = {
    "created_at": 0,
    "is_confirmed": 0,
    "is_deactivated": 0
}

const create_waiter = async (name, email, password, restaurant, mobile, gender) => {
    const new_waiter_document = new Waiter({
        name: name,
        email: email,
        password: password,
        restaurant: restaurant,
        mobile: mobile,
        gender: gender
    })
    const new_waiter = await new_waiter_document.save()
    return new_waiter
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
        "_id": waiter_id
    }, RESTRICTED_PROJECTIONS)
    return waiter
}

const get_waiter_by_email = async (email) => {
    const waiter = await Waiter.findOne({
        "email": email
    })
}

const get_waiter_by_mobile = async (mobile) => {
    const waiter = await Waiter.findOne({
        "mobile": mobile
    }, RESTRICTED_PROJECTIONS)
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
    get_waiter_by_email,
    get_waiter_by_mobile
}