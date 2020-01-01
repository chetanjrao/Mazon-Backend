const inorder_payload = (destination_name, name) => {
    var payload = {
        "notification": {
            "title": "New Inorder Recieved",
            "body": `Hey, There's a new inorder by ${name}. Click here to view`
        },
        "data": {
            "name": name,
        }
    }
    return payload
}

const booking_payload = (destination_name, name, otp) => {
    var payload = {
        "notification": {
            "title": "New Table Booking Recieved",
            "body": `Hey, There's a new table booking by ${name}. Click here to view. Booking OTP is ${otp}`
        },
        "data": {
            "name": name,
            "otp": otp
        }
    }
    return payload
}

const booking_comfirm_payload = (destination_name, name, restaurant_name) => {
    var payload = {
        "notification": {
            "title": "New Table Booking Recieved",
            "body": `Hey ${name}, Your table booking at ${restaurant_name} has been confirmed. Show your OTP while dining. Happy Dining`
        },
        "data": {
            "name": name
        }
    }
    return payload
}

const booking_cancel_payload = (destination_name, name, restaurant_name) => {
    var payload = {
        "notification": {
            "title": "Table booking Canceled",
            "body": `Hey ${name}, Your table booking at ${restaurant_name} has been cancelled. Sorry for the inconvenience`
        },
        "data": {
            "name": name
        }
    }
    return payload
}

const booking_activate_payload = (destination_name, name, restaurant_name) => {
    var payload = {
        "notification": {
            "title": "Table booking Activated",
            "body": `Hey ${name}, Your table booking at ${restaurant_name} has been activated. Happy Dining. Scan the QR Code on the table and start dining`
        },
        "data": {
            "name": name
        }
    }
    return payload
}

const booking_finish_payload = (destination_name, name, restaurant_name, amount) => {
    var payload = {
        "notification": {
            "title": "Table booking Finished",
            "body": `Hey ${name}, Your table booking at ${restaurant_name} has been finished. You have paid Rs. ${amount} /-. Thank you for dining with us`
        },
        "data": {
            "name": name
        }
    }
    return payload
}

module.exports = {
    inorder_payload,
    booking_payload,
    booking_comfirm_payload,
    booking_cancel_payload,
    booking_activate_payload,
    booking_finish_payload
}