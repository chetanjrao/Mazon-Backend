/*
 * Created on Wed Jan 15 2020
 *
 * Author - Chethan Jagannatha Kulkarni, Director, CoFounder, CTO, Mazon Technologies Pvt. Ltd. 
 * Copyright (c) 2020 Mazon Technologies Pvt. Ltd.
 */

const Restaurants = require('../models/restaurant.model')
const Menu = require('../models/menu.model')
const RatingReview = require('../models/ratingreview.model')
const User = require('../models/user.model')
const Dish  = require('../models/dish.model')
const Category = require('../models/category.model')
const {
    get_suggested_restaurant
} = require('./suggestions.service')

const get_restaurant = async (restaurantID) => {
    const restaurant = await Restaurants.findOne({ "_id": restaurantID})
    return restaurant
}

const get_restaurant_menu = async (restaurantID) => {
    const suggested_restaurant = await get_suggested_restaurant(restaurantID)
    const restaurant_menu = await Menu.aggregate([
        {
            $match: {
                rId: suggested_restaurant,
                isAvailable: true
            }
        },
        {
            $group: {
                "_id": {
                    "cId": "$cId"
                },
                "items": {
                    "$push": {
                        "id": "$_id",
                        "name": "$name",
                        "dish_id": "$dish_id",
                        "category": "$category",
                        "sub_category": "$sub_category",
                        "price": "$price",
                        "isFeatured": "$isFeatured",
                        "inorder": {
                            "$size": "$inorders"
                        },
                        "images": "$images"
                    }
                }
            }
        },
        {
            $project: {
                "_id": null,
                "cId": "$_id.cId",
                "items": "$items"
            }
        }
    ])
    const dish_populated_menu = await Dish.populate(restaurant_menu, {
        "path": "items.dish_id",
        "select": "name isVeg description"
    })
    const category_populated_menu = await  Category.populate(dish_populated_menu, {
        "path":"cId",
        "select": "name"
    })
    return category_populated_menu
}

const get_restaurant_rating = async (restaurantID) => {
    const rating_reviews = await RatingReview.find({
        "review_dest": restaurantID
    })
    const populated_ratings = await User.populate(rating_reviews, {
        "path": "user",
        "select": "name"
    })
    const overall_rating_reviews = await RatingReview.aggregate([
        {
            $match: {
                "review_dest": restaurantID
            },
        },
        {
            $group: {
            _id: null,
            total: {
                $sum: 1
            },
            rating: {
                $avg: "$rating",
            },
            ambience: {
                $avg: "$apetite"
            },
            hygine: {
                $avg: "$satisfaction"
            }
        } }, {
        $project: {
            _id: 0,
            "rating": "$rating",
            "ambience": "$ambience",
            "hygine": "$hygine",
            "total": "$total"
        }
    }])
    return {
        "summary": overall_rating_reviews,
        "rating_reviews": populated_ratings
    }
}

module.exports = {
    get_restaurant,
    get_restaurant_menu,
    get_restaurant_rating
}