const Suggestion = require('../models/suggestion.model')

const create_suggestion = async (name, latitude, longitude, contact, created_by) => {
    const new_suggestion_document = new Suggestion({
        name: name,
        location: {
            latitude: latitude,
            longitude: longitude
        },
        contact: contact,
        created_by: created_by
    })
    const new_suggestion = await new_suggestion_document.save()
    return new_suggestion
}

const get_suggested_restaurant = async (restaurant_id) => {
    const suggestion = await Suggestion.findOne({
        "is_onboarded": true,
        "onboarded_as": restaurant_id
    })
    return suggestion["_id"]
}

const get_user_suggestions = async (user) => {
    const user_suggestions = await Suggestion.find({
        "created_by": user
    })
    return user_suggestions
}

module.exports = {
    create_suggestion,
    get_user_suggestions,
    get_suggested_restaurant
}