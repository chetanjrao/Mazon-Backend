const Events = require('../models/event.model')

const create_event = async (name, restaurant, city, start_date, end_date, description, start_time, end_time, venue, latitude, longitude, image="", created_by, incharge_name, incharge_contact, website='') => {
    const event_document = new Events({
        name: name,
        restaurant: restaurant,
        start_date: start_date,
        description: description,
        end_date: end_date,
        city: city,
        start_time: start_time,
        end_time: end_time,
        venue: venue,
        coordinates: {
            latitude: latitude,
            longitude: longitude
        },
        image: image,
        incharge_name: incharge_name,
        incharge_contact: incharge_contact,
        website: website,
        created_by: created_by
    })
    const new_event = await event_document.save()
    return new_event
    //TODO: Send Notifications to city users
}

const disable_event = async (event_id, disabled_by) => {
    const updated_event = await Events.findOneAndUpdate({
        "_id": event_id
    }, {
        $set: {
            is_disabled: true,
            disabled_at: new Date(),
            disabled_by: disabled_by
        }
    })
    return updated_event
}

const confirm_event = async (event_id, confirmed_by) => {
    const updated_event = await Events.findOneAndUpdate({
        "_id": event_id
    }, {
        $set: {
            is_confirmed: true,
            confirmed_at: new Date(),
            confirmed_by: confirmed_by
        }
    })
    return updated_event
}

const add_to_interested = async (event_id, user_id) => {
    const updated_event = await Events.findOneAndUpdate({
        "_id": event_id
    }, {
        $push: {
          "interested": user_id  
        }
    })
    return updated_event
}

const get_event_details = async (event_id) => {
    const event = await Events.findOne({
        "_id": event_id
    })
    return event
}

const get_restaurant_events = async (restaurant_id) => {
    const event = await Events.findOne({
        "restaurant": restaurant_id
    }).sort({
        "created_at": -1
    })
    return event
}


module.exports = {
    create_event,
    disable_event,
    confirm_event,
    add_to_interested,
    get_event_details,
    get_restaurant_events
}