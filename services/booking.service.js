const Bookings = require("../models/Booking")
const {
    generate_unique_identifier
} = require("./utils.service")
const BookingToken = require("../models/BookingToken")

const place_booking = async (rId, email, phone, token, male, female, name, coupon, date, time) => {
    const new_booking_document = new Bookings({
        rId: rId,
        email: email,
        phone: phone,
        token: token,
        male: male,
        female: female,
        name: name,
        date: date,
        time: time,
        coupon: coupon
    })
    const new_booking = await new_booking_document.save()
    return new_booking
}

const create_booking_token = async (restaurant_id, user, ip) => {
    const token = generate_unique_identifier(10)
    const now = new Date()
    now.setHours(now.getHours() + 12)
    const expiry = new Date(now)
    const new_token_document = new BookingToken({
        user: user,
        token: token,
        expiry: expiry,
        restaurant_id: restaurant_id,
        ip: ip
    })
    const new_token = await new_token_document.save()
    return new_token
}

const get_booking_token = async (token, user, restuarant_id) => {
    return await BookingToken.findOne({
        "token": token,
        "user": user,
        "restaurant_id": restuarant_id
    })
}

const validate_booking_token = async (token, user, restuarant_id) => {
    const user_token = await get_booking_token(token, user, restuarant_id)
    if(user_token["_id"] != undefined){
        const now = new Date()
        const expiry = user_token["expiry"]
        if(now < expiry){
            return true
        }
    }
    return false
}

const get_booking_on_reference = async (id) => {
    const booking = await Bookings.findOne({
        "_id": id
    })
    return booking
}

const edit_status = async (id, status, updated_by) => {
    const edited_document = await Bookings.findOneAndUpdate({
        "_id": id
    }, {
        $set: {
            status: status,
            last_updated: new Date(),
            last_updated_by: updated_by
        }
    })
    return edited_document
}

const get_bookings_with_email = async (email) => {
    const bookings = await Bookings.find({
        "email": email
    })
    return bookings
}

const get_bookings_with_restaurant = async (restaurant) => {
    const bookings = await Bookings.find({
        "rId": restaurant
    })
    return bookings
}

const finish_booking = async (amount, payment_mode, finished_by) => {
    const finished_document = await Bookings.findOneAndUpdate({
        "_id": id
    }, {
      $set: {
            "status": 4,
            "amount": amount,
            "payment_mode": payment_mode,
            "is_paid": true,
            "last_updated": new Date(),
            "last_updated_by": finished_by
      }  
    }, {new: true})
    return finished_document
}

module.exports = {
    place_booking,
    edit_status,
    finish_booking,
    validate_booking_token,
    create_booking_token,
    get_booking_on_reference,
    get_bookings_with_email,
    get_bookings_with_restaurant
}