const Bookings = require("../models/booking.model")
const {
    generate_unique_identifier
} = require("./utils.service")
const Restaurants = require("../models/restaurant.model")

const place_booking = async (rId, email, phone, otp, male, female, name, coupon, date, time, created_by, device, remarks) => {
    console.log(device)
    const new_booking_document = new Bookings({
        rId: rId,
        email: email,
        phone: phone,
        otp: otp,
        male: male,
        female: female,
        name: name,
        date: date,
        device_id: [device],
        time: time,
        coupon: coupon,
        created_by: created_by,
        remarks: remarks
    })
    const new_booking = await new_booking_document.save()
    return new_booking
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

const get_bookings_with_email_base = async (email) => {
    const bookings = await Bookings.find({
        "email": email
    }, {
        "__v": 0,
        "device_id": 0,
        "last_updated_by": 0
    })
    return Restaurants.populate(bookings, {
        path: "rId",
        select: "name"
    })
}

const get_bookings_with_restaurant = async (restaurant) => {
    const bookings = await Bookings.find({
        "rId": restaurant
    })
    return bookings
}


const finish_booking = async (amount, payment_mode, finished_by, id) => {
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
    get_booking_on_reference,
    get_bookings_with_email,
    get_bookings_with_email_base,
    get_bookings_with_restaurant
}