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
const Suggestions = require('../models/suggestion.model')
const Analytics = require('../models/analytics.model')
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
                        "images": {
                            "$first": "$images"
                        }
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

const get_most_visited_restaurants = async () => {
    const most_visited_restaurants = await Analytics.aggregate([
        {
            $project: {
                scans: {
                    $size: "$scans"
                },
                "reference": "$reference"
            },
        },
        {
            $sort: {
                "scans": -1
            }
        }
    ])
    return Restaurants.populate(most_visited_restaurants, {
        "path": "reference",
        "select": "name address cuisines images"
    })
}

const get_top_restaurants = async () => {
    const most_visited_restaurants = await Analytics.aggregate([
        {
            $lookup: {
                from: "restaurantratings",
                let: { "restaurant": "$reference" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: {
                                    $eq: ["$restaurant", "$$restaurant"]
                                }
                            }
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            ratings: {
                                $avg: "$rating"
                            },
                            total: {
                                $sum: 1
                            }
                        },
                    }
                ],
                as: "ratings_data"
            }
        },
        {
            $project: {
               "_id": 0,
                "ratings_data": "$ratings_data",
                inorders: {
                    $size: "$inorders"
                },
                "reference": "$reference"
            },
        },
        {
            $sort: {
                "inorders": -1
            }
        }
    ])
    return Restaurants.populate(most_visited_restaurants, {
        "path": "reference",
        "select": "name address cuisines images"
    })
}

const featured_restaurants = async () => {
    return await Restaurants.aggregate([
        {
            $match: {
                "is_featured": true
            }
        },
        {
            $lookup: {
                from: "restaurantratings",
                let: { "restaurant": {
                    $toString: "$_id"
                } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: {
                                    $eq: ["$restaurant", "$$restaurant"]
                                }
                            }
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            ratings: {
                                $avg: "$rating"
                            },
                            total: {
                                $sum: 1
                            }
                        },
                    }
                ],
                as: "ratings_data"
            }
        },
    ])
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

const get_restaurants = async (query_string) => {
    const restaurant_documents = await Suggestions.find({
        "name": {
            $regex: query_string.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&"),
            $options: "i"
        }
    }, "_id name location address onboarded_as")
    return restaurant_documents
}

const get_searched_restaurants = async (query_string) => {
    const restaurant_documents = await Restaurants.aggregate([
        {
            $match: {
                "name": {
                    $regex: query_string.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&"),
                    $options: "i"
                }
            }
        },
        {
            $lookup: {
                from: "restaurantratings",
                let: { "restaurant": {
                    $toString: "$_id"
                } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$restaurant", "$$restaurant"]
                            }        
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            "rating": {
                                $avg: "$rating"
                            },
                            "total": {
                                $sum: 1
                            }
                        }
                    }
                ],
                as: "ratings_data"
            }
        },
        {
            $project: {
                "name": "$name",
                "description": "$description",
                "is_pure_veg": "$is_pure_veg",
                "cuisines": "$cuisines",
                "image": {
                    $arrayElemAt: ["$images", 0]
                },
                "price_for_two": "$price_for_two",
                "ratings_data": {
                    $arrayElemAt: ["$ratings_data", 0]
                }
            }
        }
    ])
    return restaurant_documents
}

module.exports = {
    get_restaurant,
    get_restaurant_menu,
    get_restaurant_rating,
    get_restaurants,
    get_searched_restaurants,
    get_most_visited_restaurants,
    featured_restaurants,
    get_top_restaurants
}