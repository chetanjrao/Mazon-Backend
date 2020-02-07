const Trending = require('../models/trending.model')
const Dish = require('../models/dish.model')

const Menu = require('../models/menu.model')
const Restaurant = require('../models/restaurant.model')
const Users = require('../models/user.model')
const FoodRating = require('../models/foodrating.model')
const {
    create_suggestion
} = require('./suggestions.service')
const Suggestion = require('../models/suggestion.model')
const Report = require('../models/report.model')

const create_trending = async (dish_id, latitude, rating, review, longitude, created_by, email, restaurant_id, contact, restaurant_name='', dish_name='', isVeg=true, images, address='')=>{
    let current_dish_id = dish_id
    let current_restaurant_id = restaurant_id
    const new_trending_document = new Trending({
        "dish_id": current_dish_id,
        restaurant: current_restaurant_id,
        images: images,
        location: {
            type: "Point",
            coordinates:[Number.parseFloat(longitude),Number.parseFloat(latitude)],
        },
        created_by: created_by
    })
    const now = new Date()
    now.setDate(now.getDate() - 7)
    const prev = new Date(now)
    const current_recent_rating = await FoodRating.find({
        $or: [
            {
                "dish_id": current_dish_id,
                "restaurant_id": current_restaurant_id,
                "user": created_by,
                "created_at": {
                    $gte: prev
                }
            }
        ]
    })
    if(current_recent_rating.length == 0){
        const new_food_rating_document = new FoodRating({
            user: created_by,
            email: email,
            rating: rating,
            review: review,
            images: images,
            dish_id: current_dish_id,
            restaurant_id: current_restaurant_id
        })
        await new_food_rating_document.save()
        const new_trending = await new_trending_document.save()
        return new_trending
    } else {
        return null
    }
}

const get_trending = async (latitude, longitude, user) => {
    try {
        const trending = await Trending.aggregate([
            {
                $geoNear: {
                    near: { 
                        type: "Point", 
                        coordinates: [
                            Number.parseFloat(longitude),
                            Number.parseFloat(latitude)
                        ] 
                    },
                    maxDistance: 20000,
                    distanceField: "dist.calculated",
                    includeLocs: "dist.location",
                    spherical: true
                 }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    {
                                        $indexOfArray: [
                                            "$reports", user 
                                        ]
                                    },
                                    -1
                                ]
                            },
                            {
                                $lt: [
                                    {
                                        $size: "$reports"
                                    },
                                    100
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    id: {
                        $last: "$_id",
                    },
                    "_id": {
                        "dish_id": "$dish_id",
                        "restaurant": "$restaurant",
                    },
                    "created_at": {
                        $first: "$created_at"
                    },
                    "dist": {
                        "$first": "$dist"
                    },
                    location: {
                        $last: "$location"
                    }
                }
            },
            {
                $lookup: {
                    from: "menus",
                    let: { restaurant: "$_id.restaurant", dish: "$_id.dish_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$rId", "$$restaurant"] },
                                        { $eq: ["$isAvailable", true] },
                                        { $eq: ["$dish_id", "$$dish"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "menu_data" 
                }
            },
            {
                $lookup: {
                    from: "dishes",
                    let: {dish: { $toObjectId: "$_id.dish_id" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                     $eq: ["$_id", "$$dish"] 
                                }
                            }
                        },             
                        {
                            $project: {
                                "_id": 0,
                                "categories": "$categories",
                                "name": "$name",
                                "images": "$images",
                                "description": "$description",
                                "isVeg": "$isVeg"
                            }
                        },
                    ],
                    as: "dish_data" 
                }
            },
            {
                $project: {
                    "location": "$location",
                    "dist": "$dist",
                    "id": "$id",
                    "menu_data": {
                        $arrayElemAt: [ "$menu_data", 0 ]
                    },
                    "dish_data": {
                        $arrayElemAt: [ "$dish_data", 0 ]
                    }
                },
            },
            {
                $project: {
                    "dist": "$dist",
                    "location": "$location",
                    "id": "$id",
                    "dish_data": "$dish_data",
                    "image": {
                        $arrayElemAt: ["$dish_data.images", 0]
                    },
                    "price": "$menu_data.price" 
                }
            },
            {
                $project: {
                    "dist": "$dist",
                    "id": "$id",
                    "image": "$image",
                    "price": "$price",
                    "dish_data": "$dish_data",
                    "location": "$location",
                }
            },
            {
                $lookup: {
                    from: "foodratings",
                    let: {dish: "$_id.dish_id", restaurant: "$_id.restaurant" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$dish_id", "$$dish"] },
                                        { $eq: ["$restaurant_id", "$$restaurant"] }
                                    ]
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
                        },
                        {
                            $project: {
                                _id: 0,
                                ratings: {
                                    $trunc: ["$ratings"]
                                },
                                total: "$total"
                            }
                        }
                    ],
                    as: "ratings_data" 
                }
            },
            {
                $project: {
                    "_id": 0,
                    "created_at": "$created_at",
                    "id": "$id",
                    "dish_id": "$_id.dish_id",
                    "restaurant_id": "$_id.restaurant",
                    "price": "$price",
                    "location": "$location",
                    "image": "$image",
                    "dist": "$dist",
                    "dish_data": "$dish_data",
                    "ratings_data": {
                        $arrayElemAt: [ "$ratings_data" ,0]
                    },
                }
            },
            {
                $project: {
                    "id": "$id",
                    "dish_id": "$dish_id",
                    "restaurant_id": "$restaurant_id",
                    "price": "$price",
                    "created_at": "$created_at",
                    "main_image": "$main_image",
                    "categories": "$dish_data.categories",
                    "name" : "$dish_data.name",
                    "dist": "$dist",
                    "location": "$location",
                    "description" : "$dish_data.description",
                    "isVeg": "$dish_data.isVeg",
                    "image": "$image",
                    "ratings": "$ratings_data.ratings",
                    "total": "$ratings_data.total"
                }
            },
            {
                $sort: {
                    "created_at": -1
                }
            },
            {
                $limit: 100
            }
        ])
        return trending
    } catch(ERROR){
        console.log(ERROR)
        return []
    }
}

const get_suggestions = async () => {
    try{
        const suggestions = await Menu.aggregate([
            {
                $match: {
                    isAvailable: true
                }
            },
            {
                $project: {
                    "dish_id": "$dish_id",
                    "rId": "$rId",
                    "price": "$price",
                    "image": {
                        $arrayElemAt: ["$images", 0]
                    },
                    "inorders": {
                        $size: "$inorders"
                    }
                }
            },
            {
                $lookup: {
                    from: "dishes",
                    let: {dish: { $toObjectId: "$dish_id" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                     $eq: ["$_id", "$$dish"] 
                                }
                            }
                        },             
                        {
                            $project: {
                                "_id": 0,
                                "categories": "$categories",
                                "name": "$name",
                                "description": "$description",
                                "isVeg": "$isVeg"
                            }
                        },
                    ],
                    as: "dish_data" 
                }
            },
            {
                $lookup: {
                    from: "foodratings",
                    let: {dish: "$dish_id", restaurant: "$rId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$dish_id", "$$dish"] },
                                        { $eq: ["$restaurant_id", "$$restaurant"] }
                                    ]
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
                        },
                        {
                            $project: {
                                _id: 0,
                                ratings: {
                                    $trunc: ["$ratings"]
                                },
                                total: "$total"
                            }
                        }
                    ],
                    as: "ratings_data" 
                }
            },
            {
                $project: {
                    "dish_id": "$dish_id",
                    "rId": "$rId",
                    "price": "$price",
                    "inorders": "$inorders",
                    "image": "$image",
                    "dish_data": {
                        $arrayElemAt: ["$dish_data", 0]
                    },
                    "ratings_data": {
                        $arrayElemAt: ["$ratings_data", 0]
                    }
                }
            },
            {
                $project: {
                    "dish_id": "$dish_id",
                    "rId": "$rId",
                    "price": "$price",
                    "inorders": "$inorders",
                    "categories": "$dish_data.categories",
                    "name": "$dish_data.name",
                    "image": "$image",
                    "description": "$dish_data.description",
                    "isVeg": "$dish_data.isVeg",
                    "ratings": "$ratings_data.ratings",
                    "total": "$ratings_data.total"
                }
            },
            {
                $sort: {
                    "inorders": -1
                }
            },
            {
                $limit: 100
            }
        ])
        return suggestions    
    } catch(ERROR){
        console.log(ERROR)
        return []
    }
}

const get_featured = async () => {
    try {
        const featured = await Menu.aggregate([
            {
                $match: {
                    "isAvailable": true,
                    "isFeatured": true
                }
            },
            {
                $group: {
                    "_id": {
                        "restaurant_id": "$rId"
                    },
                    "dish_id": {
                        $first: "$dish_id"
                    },
                    "price": {
                        $first: "$price"
                    },
                    "inorders": {
                        $sum: {
                            $size: "$inorders"
                        }
                    }
                }
            },
            {
                $project: {
                    "image": {
                        $arrayElemAt: ["$menu_data.images", 0]
                    },
                    "dish_id": "$dish_id",
                    "price": "$price",
                    "inorders": "$inorders"
                }
            },
            {
                $lookup: {
                    from: "dishes",
                    let: {dish: { $toObjectId: "$dish_id" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                     $eq: ["$_id", "$$dish"] 
                                }
                            }
                        },             
                        {
                            $project: {
                                "_id": 0,
                                "categories": "$categories",
                                "name": "$name",
                                "description": "$description",
                                "isVeg": "$isVeg"
                            }
                        },
                    ],
                    as: "dish_data" 
                }
            },
            {
                $lookup: {
                    from: "foodratings",
                    let: {dish: "$dish_id", restaurant: "$_id.restaurant_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$dish_id", "$$dish"] },
                                        { $eq: ["$restaurant_id", "$$restaurant"] }
                                    ]
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
                        },
                        {
                            $project: {
                                _id: 0,
                                ratings: {
                                    $trunc: ["$ratings"]
                                },
                                total: "$total"
                            }
                        }
                    ],
                    as: "ratings_data" 
                }
            },
            {
                $project: {
                    "dish_id": "$dish_id",
                    "price": "$price",
                    "image": "$image",
                    "inorders": "$inorders",
                    "dish_data": {
                        $arrayElemAt: [ "$dish_data" ,0]
                    },
                    "ratings_data": {
                        $arrayElemAt: [ "$ratings_data" ,0]
                    },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "restaurant_id": "$_id.restaurant_id",
                    "dish_id": "$dish_id",
                    "price": "$price",
                    "categories": "$dish_data.categories",
                    "name" : "$dish_data.name",
                    "description" : "$dish_data.description",
                    "isVeg": "$dish_data.isVeg",
                    "image": "$image",
                    "inorders": "$inorders",
                    "ratings": "$ratings_data.ratings",
                    "total": "$ratings_data.total"
                }
            },
            {
                $limit: 100
            }
        ])
        return featured
    }catch(ERROR){
        console.log(ERROR)
        return []
    }

}

const get_searched_dish = async (search="", user) => {
    var user_preference = -1;
    if(user != undefined){
        const current_user = await Users.findOne({
            "email": user
        })
        if(current_user != null){
            if(current_user["food_preferences"]["pure_veg"] === false){
                user_preference = 1
            }
        }
    }
    try {
        const searched_documents = await Dish.aggregate([
            {
                $match: {
                    "slug": {
                        $regex: search,
                        $options: "ix"
                    }
                }
            },
            {
                $project: {
                    "name": "$name",
                    "isVeg": "$isVeg",
                    "categories": "$categories",
                    "cuisines": "$cuisines",
                    "description": "$description"
                }
            },
            {
                $lookup: {
                    from: "foodratings",
                    let: {dish: {
                        $toString: "$_id"
                    } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$dish_id", "$$dish"] }
                                    ]
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
                        },
                        {
                            $project: {
                                _id: 0,
                                ratings: {
                                    $trunc: ["$ratings"]
                                },
                                total: "$total"
                            }
                        }
                    ],
                    as: "ratings_data" 
                }
            },
            {
                $sort: {
                    isVeg: user_preference
                }
            }
        ])
        return searched_documents
    }catch(ERROR){
        console.log(ERROR);
        return []
    }
}

const push_reports = async (user_id, trending_id, report_reason) => {
    const new_report = new Report({
        user: user_id,
        destination: trending_id,
        report: report_reason
    })
    await new_report.save()
    const trending = await Trending.findOneAndUpdate({
        "_id": trending_id
    }, {
        $addToSet: {
            reports: user_id
        }
    })
    return trending
}

module.exports = {
    create_trending,
    get_trending,
    get_suggestions,
    get_featured,
    get_searched_dish,
    push_reports
}