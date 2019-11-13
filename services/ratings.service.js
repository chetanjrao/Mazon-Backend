const mongoose = require('mongoose')
const RatingReviews = require('../modals/RatingReview')
const Restaurant = require('../modals/Restaurant')
const {
    check_restaurant
} = require('../services/restaurant.service')
const {
    get_user_details
} = require('../services/user.service')

const getRestaurantRatingReviews = async (restaurantID) => {
    const check_restaurant_validity = await check_restaurant(restaurantID)
    var ratingsReviews = []
    var overall_rating = 0;
    var incrementer = 0;
    if(check_restaurant_validity){
        const ratings_reviews = await RatingReviews.find({
            "reviewDest": restaurantID,
            "isValid": true,
            "isRemoved": false
        })
        for(incrementer=0;incrementer<ratings_reviews.length;incrementer++){
            const ratings = ratings_reviews[incrementer]
            const user = await get_user_details(ratings["uID"])
            overall_rating += Number.parseFloat(ratings["rating"])
            ratingsReviews.push({
                "rating": ratings["rating"],
                "review": ratings["review"],
                "datetime": ratings["dateTime"],
                "user": user["email"],
                "name": user["name"],
                "is_premium": user["is_premium"]
            })
        }
        overall_rating /= incrementer
        return {
            "overall_rating": overall_rating,
            "rating_reviews": ratingsReviews
        };
    } else {
        const error = new Error("Invalid Restaurant ID")
        error.status = 400
        throw error
    }
}

const post_rating_review = async (destination, type, rating, review, user, apetite, satisfaction) => {
    const now = new Date()
    const new_rating = new RatingReviews({
        "uID": user,
        "reviewDest": destination,
        "type": type,
        "rating": rating,
        "review": review,
        "remarks": remarks,
        "dateTime": now,
        "isRemoved": false,
        "isValid": true,
        "satisfaction": satisfaction,
        "apetite": apetite,
        "updated_at": now,
        "updated_by": user,
        "remarks": ""
    })
    const rating_document = await new_rating.save()
    if(rating_document == undefined || rating_document == {}) {
        return false
    }
    return true
}

const update_rating_review = async (review_id, rating, review, apetite, satisfaction) => {
    const now = new Date()
    const updated_rating = await RatingReviews.updateOne({
        "_id": review_id
    }, {
        "rating": rating,
        "review": review,
        "apetite": apetite,
        "satisfaction": satisfaction
    }).exec()

}

const get_particular_rating_review = async (rating_id) => {
    const rating_review = await RatingReviews.findOne({
        "_id": rating_id
    })
    return rating_review
}

const disable_rating_review = async (rating_id, updated_by) => {
    const rating = await get_particular_rating_review(rating_id)
     const updated_document = await rating.updateOne({
         $set: {
            isValid: false,
            updated_at: new Date(),
            updated_by: updated_by
         }
     })
     return updated_document
}

const delete_rating_review = async (rating_id, deleted_by) => {
    const rating = await get_particular_rating_review(rating_id)
     const deleted_document = await rating.updateOne({
         $set: {
            isRemoved: true,
            updated_at: new Date(),
            updated_by: deleted_by
         }
     })
     return deleted_document
}

module.exports = {
    getRestaurantRatingReviews,
    post_rating_review,
    update_rating_review,
    disable_rating_review,
    delete_rating_review
}