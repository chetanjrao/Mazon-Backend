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

const create_trending = async (dish_id, latitude, rating, review, longitude, created_by, email, restaurant_id, contact, restaurant_name='', dish_name='', isVeg=true, images, address='')=>{
    let current_dish_id = dish_id
    let current_restaurant_id = restaurant_id
    if(dish_id == undefined){
        const dish_check = await Dish.findOne({
            "name": dish_name
        })
        if(dish_check == null){
            let slug = ""
            let split = dish_name.split(' ')
            for(let i=0;i<split.length;i++){
                slug += split[i].toLowerCase()
            }
            const new_dish_document = new Dish({
                name: dish_name,
                images: images,
                slug: slug,
                isVeg: isVeg,
                created_by: created_by
            })
            const new_dish = await new_dish_document.save()
            current_dish_id = new_dish["_id"]
        } else {
            current_dish_id = dish_check["_id"]
        }
    }
    if(dish_id != undefined){
        await Dish.findOneAndUpdate({
            "_id": current_dish_id
        }, {
            $push: {
                images: images
            }
        })
    }
    await Menu.findOneAndUpdate({
        "dish_id": current_dish_id,
        "rId": current_restaurant_id
    }, {
        $push: {
            images: images
        }
    })
    if(restaurant_id == undefined){
        const restaurant_check = await Suggestion.findOne({
            "name": restaurant_name
        })
        if(restaurant_check == null){
            const new_restaurant = await create_suggestion(restaurant_name, latitude, longitude, contact, email, address)
            current_restaurant_id = new_restaurant['_id']
        } else {
            current_restaurant_id = restaurant_check["_id"]
        }
    }
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
}

const get_trending = async (latitude, longitude) => {
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
                    //maxDistance: 20000,
                    distanceField: "dist.calculated",
                    includeLocs: "dist.location",
                    spherical: true
                 }
            },
            {
                $group: {
                    "_id": {
                        "dish_id": "$dish_id",
                        "restaurant": "$restaurant",
                        "name": "$name",
                        "main_image": "$images",
                        "isVeg": "$isVeg",
                        "dist": "$dist",
                        "description": "$description",
                        "created_at": "$created_at"
                    },
                    location: {
                        $last: "$location"
                    },
                    "rating": {
                        $avg: "$rating"
                    },
                    "total": {
                        $sum: 1
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
                $project: {
                    "location": "$location",
                    "dist": "$_id.dist",
                    "menu_data": {
                        $arrayElemAt: [ "$menu_data", 0 ]
                    }
                },
            },
            {
                $project: {
                    "dist": "$dist",
                    "location": "$location",
                    "image": {
                        $arrayElemAt: ["$menu_data.images", 0]
                    },
                    "price": "$menu_data.price" 
                }
            },
            {
                $project: {
                    "dist": "$dist",
                    "image": "$image",
                    "price": "$price",
                    "location": "$location",
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
                    "created_at": "$_id.created_at",
                    "main_image": "$_id.main_image",
                    "dish_id": "$_id.dish_id",
                    "restaurant_id": "$_id.restaurant",
                    "price": "$price",
                    "location": "$location",
                    "image": "$image",
                    "dist": "$dist",
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

module.exports = {
    create_trending,
    get_trending,
    get_suggestions,
    get_featured,
    get_searched_dish
}