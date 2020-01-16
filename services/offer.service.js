const Offers = require('../models/offer.model')
const Restaurants = require('../models/restaurant.model')
const {
    get_user
} = require('./user.service')

const create_offer = async (code, image='', description, expiry, offer_type, is_discount, is_percent, discount_amount, max, min_amount, on_weekdays, created_by, is_universal=true, applies_to=[], availed_by=[]) => {
    const offer_document = new Offers({
        code: code,
        image: image,
        description: description,
        expiry: expiry,
        offer_type: offer_type,
        on_weekdays: on_weekdays,
        min_amount: min_amount,
        is_universal: {
            is_universal: is_universal,
            applies_to: applies_to
        },
        is_discount: {
            is_discount: is_discount,
            is_percent: is_percent,
            discount_amount: discount_amount,
            max: max
        },
        availed_by: availed_by,
        created_by: created_by
    })
    const new_offer = await offer_document.save()
    return new_offer
}

const check_offer = async (restaurant_id, offer_code) => {
    const offer_document = await Offers.findOne({
        "code": offer_code,
        "is_approved.is_approved": true
    })
    if(offer_document != null){
        const now = new Date()
        const expiry = offer_document["expiry"]
        if(now < expiry){
            if(offer_document["is_universal"]["is_universal"]){
                return true
            } else {
                if(offer_document["is_universal"]["applies_to"].indexOf(restaurant_id) != -1){
                    return true
                }
                return false
            }
        } 
        return false
    }
    return false
}

const check_offer_strict_user = async (restaurant_id, offer_code, user_id) => {
    const offer_document = await Offers.findOne({
        "code": offer_code,
        "is_approved.is_approved": true
    })
    if(offer_document != null){
        const now = new Date()
        const expiry = offer_document["expiry"]
        if(now < expiry){
            if(offer_document["is_universal"]["is_universal"]){
                return true
            } else {
                if(offer_document["is_universal"]["applies_to"].indexOf(restaurant_id) != -1){
                    const user_document = await get_user(user_id)
                    const user_avails = user_document["offers_availed"]
                    var user_offers = []
                    for(var i=0;i<user_avails.length;i++){
                        user_offers.push(user_avails[i]["offer_code"])
                    }
                    var user_offer_count = 0;
                    for(var j=0;j<user_offers.length;j++){
                        if(user_offers[j] == offer_code){
                            user_offer_count += 1;
                        }
                    }
                    if(user_offer_count < offer_document["max_user_avails"]){
                        return offer_document
                    }
                    
                    return null
                }
                return null
            }
        } 
        return null
    }
    return null
}

const avail_offer = async (restaurant_id, offer_id) => {
    const availed_offer = await Offers.findOneAndUpdate({
        "code": offer_id
    }, {
        $addToSet: {
            "is_universal.applies_to": restaurant_id
        }
    })
    return availed_offer
}

const unavail_offer = async (restaurant_id, offer_id) => {
    const availed_offer = await Offers.findOneAndUpdate({
        "code": offer_id
    }, {
        $pull: {
            "is_universal.applies_to": restaurant_id
        }
    })
    return availed_offer
}

const get_restaurant_offers = async (restaurant_id) => {
    const date = new Date()
    if(date.getDay() != 0 && date.getDay() != 6){
        const offers = await Offers.find({
            $or: [
                {
                    "is_universal.is_universal": true
                },
                {
                    "is_universal.is_universal": false,
                    "on_weekdays": true,
                    "is_universal.applies_to": {
                        $in: [restaurant_id]
                    }
                }
            ]
        })

    return offers
    } else {
        const offers = await Offers.find({
            "is_universal.is_universal": false,
            "on_weekdays": false,
            "is_universal.applies_to": {
                $in: [restaurant_id]
            }
        })

    return offers
    }
}

const get_all_offers = async (restaurant_id) => {
    const date = new Date()
    const data = {}
    if(date.getDay() != 0 && date.getDay() != 6){
        const offers = await Offers.find({
            "is_universal.is_universal": false,
            "on_weekdays": false
        })
        data["is_weekday"] = true
        data["offers"] = offers
    } else {
        const offers = await Offers.find({
            "is_universal.is_universal": false,
            "on_weekdays": true
        })
        data["is_weekday"] = false
        data["offers"] = offers
    }
    const availed = await Offers.find({
        "is_universal.applies_to": {
            $in: [restaurant_id]
        }
    })
    data["availed"] = availed
    return data
}

const get_offer_details = async (offer_code) => {
    const offer = await Offers.findOne({
        "code": offer_code
    })
    return offer
}

module.exports = {
    create_offer,
    avail_offer,
    unavail_offer,
    get_restaurant_offers,
    get_offer_details,
    check_offer,
    get_all_offers,
    check_offer_strict_user
}