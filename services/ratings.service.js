const mongoose = require('mongoose')
const RatingReviews = require('../models/ratingreview.model')
const Restaurant = require('../models/restaurant.model')
const {
    check_restaurant
} = require('../services/restaurant.service')
const {
    get_user_details
} = require('../services/user.service')
const Users = require('../models/user.model')

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

const post_rating_review = async (destination, type, rating, reference, review, user, apetite, satisfaction, email) => {
    const new_rating = new RatingReviews({
        user: user,
        reviewDest: destination,
        type: type,
        email: email,
        reference: reference,
        rating: rating,
        review: review,
        satisfaction: satisfaction,
        apetite: apetite
    })
    const rating_document = await new_rating.save()
    return rating_document
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
    })
    return updated_rating
}

const get_particular_rating_review = async (rating_id) => {
    const rating_review = await RatingReviews.findOne({
        "_id": rating_id
    })
    return rating_review
}

const get_destination_rating_review = async (destination_id) => {
    const rating_review = await RatingReviews.find({
        "reviewDest": destination_id
    })
    return rating_review
}

const get_aggregation_rating = async (destination_id) => {
    const rating_review = await RatingReviews.aggregate([
        {
            $match: {
                "reviewDest": destination_id,
                "isValid": true,
                "isRemoved": false
            }
        },
        {
            $group: {
                "_id": "$user",
                "rating": {
                    $avg: "$rating"
                },
                "user": {
                    $last: "$user"
                },
                "review": {
                    $last: "$review"
                },
                "date_time": {
                    $last: "$dateTime"
                },
                "satisfaction": {
                    $last: "$satisfaction"
                },
                "apetite": {
                    $last: "$apetite"
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "user": "$user",
                "rating": "$rating",
                "overall": "$overall",
                "review": "$review",
                "date_time": "$date_time",
                "satisfaction": "$satisfaction",
                "apetite": "$apetite"
            }
        }
    ])
    return await Users.populate(rating_review, {
        "path": "user",
        "select": "first_name image"
    })
}

const get_final_rating = async (destination_id) => {
    const rating_review = await RatingReviews.aggregate([
        {
            $match: {
                "reviewDest": destination_id,
                "isValid": true,
                "isRemoved": false
            }
        },
        {
            $group: {
                "_id": null,
                "overall": {
                    $avg: "$rating"
                },
                "satisfaction": {
                    $avg: "$satisfaction"
                },
                "apetite": {
                    $avg: "$apetite"
                },
                "total": {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                "_id": 0,
                // "total": "$total",
                // "overall": "$overall",
                // "satisfaction": "$satisfaction"
            }
        }
    ])
    if(rating_review.length > 0){
        return rating_review[0]
    } else {
        return {
            "overall": 0,
            "satisfaction": 0,
            "apetite": 0,
            "total": 0
        }
    }
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

const get_user_rating_review = async (user_id) => {
    const ratings = await RatingReviews.find({
        "user": user_id
    })
    return ratings
}

const get_user_email_rating_review = async (user_email) => {
    const ratings = await RatingReviews.find({
        "email": user_email
    })
    return ratings
}

module.exports = {
    getRestaurantRatingReviews,
    post_rating_review,
    update_rating_review,
    disable_rating_review,
    delete_rating_review,
    get_destination_rating_review,
    get_aggregation_rating,
    get_final_rating,
    get_user_rating_review,
    get_user_email_rating_review
}