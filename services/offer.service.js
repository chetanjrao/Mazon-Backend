const Offers = require('../models/Offer')
const Restaurants = require('../models/Restaurant')

const create_offer = async (code, image='', description, expiry, offer_type, on_weekdays, created_by, is_universal=true, applies_to=[]) => {
    const offer_document = new Offers({
        code: code,
        image: image,
        description: description,
        expiry: expiry,
        offer_type: offer_type,
        on_weekdays: on_weekdays,
        is_universal: {
            is_universal: is_universal,
            applies_to: applies_to
        },
        created_by: created_by
    })
    const new_offer = await offer_document.save()
    return new_offer
}

const check_offer = async (restaurant_id, offer_code) => {
    const offer_document = await Offers.findOne({
        "code": offer_code
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

const avail_offer = async (restaurant_id, offer_id) => {
    const availed_restaurant = await Restaurants.findOne({
        "_id": restaurant_id
    })
    if(availed_restaurant["offers"].indexOf(offer_id) == -1){
        await availed_restaurant.updateOne({
            $set: {
                $push: {
                    offers: offer_id
                }
            }
        })
    }
    return availed_restaurant
}

const unavail_offer = async (restaurant_id, offer_id) => {
    const availed_restaurant = await Restaurants.findOne({
        "_id": restaurant_id
    })
    if(availed_restaurant["offers"].indexOf(offer_id) != -1){
        await availed_restaurant.updateOne({
            $set: {
                $pull: {
                    offers: offer_id
                }
            }
        })
    }
    return availed_restaurant
}

const get_restaurant_offers = async (restaurant_id) => {
    const restaurant = await Restaurants.findOne({
        "_id": restaurant_id
    })
    return restaurant["offers"]
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
    check_offer
}