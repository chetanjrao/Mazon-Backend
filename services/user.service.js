const mongoose = require('mongoose')
const Users = require('../models/user.model')
const Dishes = require('../models/dish.model')
const Restaurants = require('../models/restaurant.model')
const uuid = require('uuid/v4')
const EmailVerification = require('../models/emailverification.model')
const Notifications = require('../models/notifications.model')
const FoodRatings = require('../models/foodrating.model')
const Inorder = require('../models/inorder.model')
const Booking = require('../models/booking.model')
const RestaurantRatings = require('../models/restaurantrating.model')
const Otp = require('../models/otp.model')
const {
    get_inorders_with_email
} = require('./inorder.service')
const {
    get_bookings_with_email
} = require('./booking.service')
const {
    get_user_rating_review
} = require('./ratings.service')
const {
    generate_otp
} = require('./utils.service')

const get_user_details = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
    if(user["_id"] != undefined){
        return {
            "email": user["email"],
            "mobile": user["mobile"],
            "name": user["name"],
            "is_premium": user["isPremium"],
            "last_login_time": user["lastLoginTime"]
        }
    } else {
        const error = new Error("Invalid User Requested")
        error.status = 400
        throw error
    }
}
const get_user = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
   return user
}

const get_user_strict = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    }, {
        "password": 0,
        "device_id": 0,
        "created_at": 0,
        "userType": 0,
        "is_deactivated": 0,
        "registrationTime": 0,
        "__v": 0
    })
   return user
}
const get_user_details_by_email = async (email) => {
    const user = await Users.findOne({
        "$and": [
            {
                "email": email
            },
            {
                "is_deactivated.is_deactivated": false
            }
        ]
    })
    return user
}

const get_user_details_by_email_or_mobile = async (email='', mobile='') => {
    const user = await Users.findOne({
        $or: [
            {
                "email": email
            },
            {
                "mobile": mobile
            }
        ]
    })
    if(user != null){
        return {
            "_id": user["_id"],
            "email": user["email"],
            "mobile": user["mobile"],
            "name": user["name"],
            "is_premium": user["isPremium"],
            "last_login_time": user["lastLoginTime"]
        }
    }
    return null
}

const get_complete_profile = async (email, user_id) => {
    const inorders = await Inorder.find({
        "email": email
    })
    const bookings = await Booking.find({
        "email": email
    })
    let images = []
    const foodrating = await FoodRatings.find({
       "email": email
    })
    for(var i=0;i<foodrating.length;i++){
        for(var j=0;j<foodrating[i]["images"].length;j++){
            images.push(foodrating[i]["images"][j])
        }
    }
    const user_details = await get_user_strict(user_id)
    return {
        "inorders": inorders.length,
        "bookings": bookings.length,
        "ratings": foodrating.length,
        "details": user_details,
        "images": images
    } 
}

const save_food = async (user, dish_id) => {
    await Users.findOneAndUpdate({
        "email": user
    }, {
        $addToSet: {
            saved_food: dish_id
        }
    })
    await Dishes.findOneAndUpdate({
        "_id": dish_id
    }, {
        $addToSet: {
            saves: user
        }
    })
}

const unsave_food = async (user, dish_id) => {
    await Users.findOneAndUpdate({
        "email": user
    }, {
        $pull: {
            saved_food: dish_id
        }
    })
    await Dishes.findOneAndUpdate({
        "_id": dish_id
    }, {
        $pull: {
            saves: user
        }
    })
}

const save_restaurant = async (user, restaurant_id) => {
    await Users.findOneAndUpdate({
        "email": user
    }, {
        $addToSet: {
            saved_restaurants: restaurant_id
        }
    })
    await Restaurants.findOneAndUpdate({
        "_id": restaurant_id
    }, {
        $addToSet: {
            saves: user
        }
    })
}

const unsave_restaurant = async (user, restaurant_id) => {
    await Users.findOneAndUpdate({
        "email": user
    }, {
        $pull: {
            saved_restaurants: restaurant_id
        }
    })
    await Restaurants.findOneAndUpdate({
        "_id": restaurant_id
    }, {
        $pull: {
            saves: user
        }
    })
}

const create_email_verification = async (email, user) => {
    const token = uuid()
    const now = new Date()
    now.setHours(now.getHours() + 1)
    const expiry = new Date(now)
    const new_email_verification_token_document = new EmailVerification({
        token: token,
        expiry: expiry,
        email: email,
        user: user
    })
    const new_email_verification = await new_email_verification_token_document.save()
    //TODO:  Send the email
    return new_email_verification
}

const get_user_notifications = async (user) => {
    const notifications = await Notifications.find({
        "user": user
    })
    return notifications
}

const get_unread_notifications = async (user) => {
    const notifications = await Notifications.find({
        "user": user,
        "is_read": false
    })
    return notifications
}

const create_notification = async (notification, type, user) => {
    const new_notification_document = new Notifications({
        user: user,
        type: type,
        notification: notification
    })
    const new_notification = await new_notification_document.save()
    return new_notification
}

const notification_mark_read = async (user) => {
    const notifications = await Notifications.updateMany({
        "user": user
    }, {
        $set: {
            "is_read": true
        }
    })
    return notifications
}

module.exports = {
    get_user_details,
    get_user_details_by_email,
    create_email_verification,
    get_user_details_by_email_or_mobile,
    get_user,
    get_user_strict,
    get_user_notifications,
    create_notification,
    notification_mark_read,
    get_unread_notifications,
    save_food,
    save_restaurant,
    unsave_food,
    unsave_restaurant,
    get_complete_profile
}