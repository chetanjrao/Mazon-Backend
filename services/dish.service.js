const Dish = require('../models/dish.model')
const Ratings = require('../models/foodrating.model')
const Trending = require('../models/trending.model')
const mongoose = require('mongoose')
const {
    get_user_details_by_email
} = require('./user.service')

const create_dish = async (name, description, isVeg, created_by, reciepes=[], cuisines=[], ingredients=[], fType=[], categories=[]) => {
    const new_dish_document = new Dish({
        name: name,
        ingredients: ingredients,
        description: description,
        fType: fType,
        cuisines: cuisines,
        reciepes: reciepes,
        isVeg: isVeg,
        categories: [],
        created_by: created_by
    })
    const new_document = await new_dish_document.save()
    return new_document
}

const get_dish_rating = async (dish_id) => {
    const dish_ratings = await Ratings.aggregate([
        {
            $match: {
                "dish_id": dish_id
            }
        },
        {
            $group: {

            }
        },
        {
            $lookup: {
                from: "suggestions",
                let: { restaurant: {
                    toObjectId: "$restaurant_id"
                } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [ "$_id", "$$restaurant" ]
                            }
                        }
                    }
                ],
                as: "restaurant_data"
            }
        },
        {
            $group: {
                _id: null
            },

        }
    ])
    return dish_ratings
}

const get_strict_dish_rating = async (dish_id, restaurant_id) => {
    const dish_ratings = await Ratings.aggregate([
        {
            $match: {
                "dish_id": dish_id,
                "restaurant_id": restaurant_id
            }
        }
    ])
}

const get_dish = async (dish_id) => {
    const dish_document = await Dish.findOne({
        "_id": dish_id
    })
    return dish_document
}

const get_dishes = async (query_string) => {
    const dish_documents = await Dish.find({
        "slug": {
            $regex: query_string.replace(/[-[\]{}()*+?.,\\/^$|#]/g, "\\$&"),
            $options: "ix"
        }
    }, "_id isVeg name")
    return dish_documents
}

const get_dish_details = async (dish_id, user) => {
    let has_user_saved = false
    if( user != undefined && user != ''){
        const user_document = await get_user_details_by_email(user)
        if(user_document["saved_food"].indexOf(dish_id) !== -1){
            has_user_saved = true
        }
    }
    const dish_data = await Dish.aggregate([
        {
            $match: {
                "_id": mongoose.Types.ObjectId(dish_id)
            }
        },
        {
            $project: {
                "name": "$name",
                "isVeg": "$isVeg",
                "cuisines": "$cuisines",
                "categories": "$categories",
                "images": "$images",
                "ingredients": "$ingredients",
                "description": "$description",
                "saves": {
                    $size: "$saves"
                }
            }
        },
        {
            $lookup: {
                from: "foodratings",
                let: { "dish": dish_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$dish_id", "$$dish"] },
                                    { $eq: ["$is_disabled.is_disabled", false] }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { user: "$email" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$email", "$$user"]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        "_id": 0,
                                        "name": "$first_name",
                                        "image": "$image",
                                        "email": "$email"
                                    }
                                }
                            ],
                            as: "user_data"
                        }
                    },
                    {
                        $project: {
                            "_id": 0,
                            "rating": "$rating",
                            "review": "$review",
                            "images": "$images",
                            "created_at": "$created_at",
                            "days": {
                                $floor: {
                                    $divide: [
                                        {
                                            $subtract:  [
                                                new Date(),
                                                "$created_at"
                                            ]
                                        },
                                        1000*60*60*24
                                    ]
                                }
                            },
                            "user": {
                                $arrayElemAt: ["$user_data", 0]
                            }
                        }
                    },{
                        $sort: {
                            "created_at": -1
                        }
                    },
                    {
                        $limit: 10
                    }
                ],
                as:"rating_reviews"
            }
        },
        {
            $lookup: {
                from: "foodratings",
                let: { "dish": dish_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$dish_id", "$$dish"]
                            }
                        }
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
                        }
                    }
                ],
                as:"ratings_data"
            }
        },
        {
            $project: {
                "name": "$name",
                "isVeg": "$isVeg",
                "cuisines": "$cuisines",
                "categories": "$categories",
                "images": "$images",
                "ingredients": "$ingredients",
                "description": "$description",
                "saves": "$saves",
                "rating_reviews": "$rating_reviews",
                "has_user_saved": {
                    $toString: has_user_saved
                },
                "ratings_data": {
                    $arrayElemAt: [ "$ratings_data", 0 ]
                }
            }
        },
        {
            $lookup: {
                "from": "menus",
                "pipeline": [
                    {
                        $match: {
                            dish_id: dish_id,
                            isAvailable: true
                        }
                    },
                    {
                        $group: {
                            _id: {
                                "rId": "$rId"
                            },
                        }
                    },
                    {
                        $lookup: {
                            "from": "restaurants",
                            "let": {"rId": "$_id.rId"},
                            "pipeline": [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", {
                                                $toObjectId: "$$rId"
                                            }]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        "image": {
                                            $first: "$images"
                                        },
                                        "name": {
                                            $first: "$name"
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "restaurantratings",
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ["$restaurant", "$$rId"]
                                                    }
                                                }
                                            },
                                            {
                                                $group: {
                                                    _id: null,
                                                    rating: {
                                                        $avg: "$rating"
                                                    }
                                                }
                                            }
                                        ],
                                        as: "restaurant_ratings"
                                    }
                                }
                            ],
                            "as": "restaurant"
                        }
                    }
                ],
                as: "restaurant_data"
            },
        },
    ])
    return dish_data
}

const get_images = async (dish_id) => {
    let final_data = [];
    const main_images = await Dish.find({
        "dish_id": dish_id
    }, "images")
    for(let i=0;i<main_images.length;i++){
        for(let j=0;j<main_images[i]["images"].length;j++){
            final_data.push(main_images[i]["images"][j])
        }
    }
    const rev_images = await Ratings.find({
        "dish_id": dish_id
    })
    for(let i=0;i<rev_images.length;i++){
        for(let j=0;j<rev_images[i]["images"].length;j++){
            final_data.push(rev_images[i]["images"][j])
        }
    }
    const tren_images = await Tre.find({
        "dish_id": dish_id
    })
    for(let i=0;i<tren_images.length;i++){
        for(let j=0;j<tren_images[i]["images"].length;j++){
            final_data.push(tren_images[i]["images"][j])
        }
    }
    return final_data
}

module.exports = {
    create_dish,
    get_dish,
    get_images,
    get_dishes,
    get_dish_rating,
    get_dish_details
}