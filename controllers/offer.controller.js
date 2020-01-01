const {
    create_offer,
    avail_offer,
    get_offer_details,
    get_restaurant_offers,
    unavail_offer,
    get_all_offers,
    check_offer
} = require('../services/offer.service')


const create_offer_controller = async (req, res, next) => {
    const code = req.body["code"]
    const description = req.body["description"]
    const expiry = req.body["expiry"]
    const is_universal = req.body["is_universal"]
    const applies_to = req.body["applies_to"]
    const is_discount = req.body["is_discount"]
    const is_percent = req.body["is_percent"]
    const on_weekdays = req.body["on_weekdays"]
    const discount_amount = req.body["discount_amount"]
    const max = req.body["max"]
    const min_amount = req.body["min_amount"]
    const offer_type = req.body["offer_type"]
    const availed_by = req.body["availed_by"]
    const created_by = res.locals["user_id"]
    const check_offer = await get_offer_details(code)
    if(check_offer == null){
        try {
            const create_offer_document = await create_offer(code, "", description, expiry, offer_type, is_discount, is_percent, discount_amount, max, min_amount, on_weekdays, created_by, is_universal, applies_to, availed_by)
            res.json({
                "message": "Offer Created sucessfully",
                "status": 200
            })
        } catch (CREATE_OFFER_ERROR) {
            res.status(500)
            res.json({
                "message": "Failed to create offer",
                "status": 500
            })
        }
    } else {
        res.status(403)
        res.json({
            "message": "Offer Code already present",
            "status": 403
        })
    }
}

const confirm_offer_controller = async (req, res, next) => {
    
}

const check_offer_controller = async (req, res, next) => {
    const restaurant_id = req.params["restaurantID"]
    const offer_code = req.query["offer_code"]
    const offer_validity = await check_offer(restaurant_id, offer_code)
    if(offer_validity){
        res.send("ok")
    } else {
        res.status(403)
        res.json({
            "message": "Invalid coupon",
            "status": 403
        })
    }
}

const avail_offer_controller = async (req, res, next) => {
    const restaurant_id = req.body["restaurant_id"]
    const offer_id = req.body["offer_id"]
    const avail_offer_document = await avail_offer(restaurant_id, offer_id)
    if(avail_offer_document != null){
        res.json({
            "message": "Offer availed succesfully",
            "status": 200
        })
    } else {
        res.status(500)
        res.json({
            "message": "Failed to avail offer",
            "status": 200
        })
    }
}

const unavail_offer_controller = async (req, res, next) => {
    
}

const get_offers_controller = async (req, res, next) =>{
    const restaurant_id = req.params["restaurantID"]
    const offers = await get_restaurant_offers(restaurant_id)
    res.json(offers)
}

const get_all_offers_controller = async (req, res, next) =>{
    const restaurant_id = req.params["restaurantID"]
    const offers = await get_all_offers(restaurant_id)
    res.json(offers)
}

module.exports = {
    create_offer_controller,
    get_offers_controller,
    avail_offer_controller,
    unavail_offer_controller,
    check_offer_controller,
    get_restaurant_offers,
    get_all_offers_controller
}