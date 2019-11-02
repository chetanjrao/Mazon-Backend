const Bookings = require("../modals/Booking")


const place_booking = async (rId, email, phone, token, male, female, name, coupon) => {
    const new_booking_document = new Bookings({
        rId: rId,
        email: email,
        phone: phone,
        token: token,
        male: male,
        female: female,
        name: name,
        coupon: coupon
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

const finish_booking = async (amount, payment_mode, finished_by) => {
    const finshed_document = await Bookings.findOneAndUpdate({
        "_id": id
    }, {
        
    })
}

module.exports = {
    place_booking,
    edit_status,
    finish_booking
}