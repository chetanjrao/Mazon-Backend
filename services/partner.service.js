const Partners = require('../models/Partner')

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

const partner_details = async (user) => {
    const partner = await Partners.findOne({
        user: user
    })
    return partner
}

const get_partners = async (restaurant) => {
    const partner = await Partners.find({
        restaurant: restaurant
    })
    return partner
}

module.exports = {
    create_partner,
    confim_partner,
    disable_partner,
    partner_details,
    get_partners
}