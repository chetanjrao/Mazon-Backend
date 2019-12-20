const {
    create_offer,
    avail_offer,
    get_offer_details,
    get_restaurant_offers,
    unavail_offer,
    check_offer
} = require('../services/offer.service')


const create_offer_controller = async (req, res, next) => {
    const create_offer_document = await create_offer()
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

module.exports = {
    create_offer_controller,
    get_offers_controller,
    avail_offer_controller,
    unavail_offer_controller,
    check_offer_controller
}