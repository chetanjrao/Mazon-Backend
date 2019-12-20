const Partners = require('../models/Partner')
const Inorders = require('../models/Inorder')

const create_partner = async (user, restaurant) => {
    const new_partner_document = new Partners({
        user: user,
        restaurant: restaurant
    })
    const new_partner = await new_partner_document.save()
    return new_partner
}

const confim_partner = async (partner_id, confirmed_by) => {
    const partner = await Partners.findOneAndUpdate({
        "_id": partner_id
    }, {
        $set: {
            is_confirmed: {
                is_confirmed: true,
                confirmed_by: confirmed_by,
                confirmed_at: new Date()
            }
        }
    }, {
        new: true
    })
    return partner
}

const disable_partner = async (partner_id, disabled_by) => {
    const partner = await Partners.findOneAndUpdate({
        "_id": partner_id
    }, {
        $set: {
            is_disabled: {
                is_disabled: true,
                disabled_by: disabled_by,
                disabled_at: new Date()
            }
        }
    }, {
        new: true
    })
    return partner
}

const partner_details = async (user, restaurant) => {
    const partner = await Partners.findOne({
        "user": user,
        "restaurant": restaurant,
        "is_confirmed.is_confirmed": true
    })
    return partner
}

const partner_details_specs = async (user) => {
    const partner = await Partners.findOne({
        "user": user,
        "is_confirmed.is_confirmed": true
    })
    return partner
}

const get_partners = async (restaurant) => {
    const partner = await Partners.find({
        restaurant: restaurant
    })
    return partner
}

const get_inorders = async (restaurant_id) => {
    const inorders = await Inorders.find({
        "rId": restaurant_id,
        "is_paid": false
    }, {
        "device_id": 0,
        "menu": 0
    }).sort({"order_date_time": -1})
    return inorders
}

module.exports = {
    create_partner,
    confim_partner,
    disable_partner,
    partner_details,
    get_partners,
    get_inorders,
    partner_details_specs
}