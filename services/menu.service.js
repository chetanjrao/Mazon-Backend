/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const Menu = require('../models/Menu')
const {
    get_restaurant_owner_details
} = require('./restaurant.service')
const {
    get_destination_rating_review,
    get_aggregation_rating,
    get_final_rating
} = require('./ratings.service')
const EXCLUDED_PROJECTIONS = { "menu.items.created_at": 0, "menu.items.updated_at": 0, "menu.items.updated_by": 0, "menu.items.created_by": 0  }

const getFoodDetails = async (food_id, restaurant_id) => {
    const food = await Menu.findOne({
        "rID": restaurant_id,
        "menu.items._id": food_id
    }, EXCLUDED_PROJECTIONS)
    return food
}
const Restaurants = require("../models/Restaurant")

const getRestaurantMenu = async (restaurant_ID) => {
    // const restaurant_menu = await Menu.aggregate([
    //     {
    //         $unwind: "$menu"
    //     },
    //     {
    //         $unwind: "$menu.items"
    //     },
    //     {
    //         $match: {
    //             "rId": restaurant_ID,
    //             "menu.items.isAvailable": true
    //         }
    //     },
    //     {
    //         $group: {
    //             "_id": restaurant_ID,
    //             "menu": {
    //                 $push: "$menu"
    //             }
    //         }
    //     }, {
    //         $project: {
    //             "_id":0,
    //             "menu": "$menu"
    //         }
    //     }
    // ])
    const restaurant_menu = await Menu.findOne({
        "rId": restaurant_ID
    })
    const restaurant_details = await get_restaurant_owner_details(restaurant_ID)
    const menu = {}
    menu["restaurant_name"] = restaurant_details["name"]
    menu["restaurant_phone"] = restaurant_details["phNo"]
    menu["restaurant_email"] = restaurant_details["restaurantEmail"]
    menu["menu"] = restaurant_menu["menu"]
    return menu
}

const get_particular_food_details = async (restaurant_id, category_index, food_index) => {
    const food_document = await Menu.findOne({
            "rId": restaurant_id
    })
    const food = food_document["menu"][category_index]["items"][food_index]
    return food
}

const update_inorder_content = async (restaurant_id, inorder_id, c_id, f_id) => {
    const food_document = await Menu.findOneAndUpdate({
        "rId": restaurant_id,
    }, {
        $push: {
            [`menu.${c_id}.items.${f_id}.inorders`]: inorder_id
        }
    })
    return food_document
}

const enable_item = async (fId, rId, cId, user) => {
    const food_document = await Menu.findOneAndUpdate({
        "rId": rId
    }, {
        $set: {
            [`menu.${cId}.items.${fId}.isAvailable`]: true,
            [`menu.${cId}.items.${fId}.updated_at`]: new Date(),
            [`menu.${cId}.items.${fId}.updated_by`]: user
        }
    }, {
        new: true
    })
    return food_document
}

const disable_item = async (fId, rId, cId, user) => {
    const food_document = await Menu.findOneAndUpdate({
        "rId": rId
    }, {
        $set: {
            [`menu.${cId}.items.${fId}.isAvailable`]: false,
            [`menu.${cId}.items.${fId}.updated_at`]: new Date(),
            [`menu.${cId}.items.${fId}.updated_by`]: user
        }
    }, {
        new: true
    })
    return food_document
}

const enable_featuring = async (fId, rId, cId, user) => {
    const food_document = await Menu.findOneAndUpdate({
        "rId": rId
    }, {
        $set: {
            [`menu.${cId}.items.${fId}.isFeatured`]: true,
            [`menu.${cId}.items.${fId}.updated_at`]: new Date(),
            [`menu.${cId}.items.${fId}.updated_by`]: user
        }
    }, {
        new: true
    })
    return food_document
}

const disable_featuring = async (fId, rId, cId, user) => {
    const food_document = await Menu.findOneAndUpdate({
        "rId": rId
    }, {
        $set: {
            [`menu.${cId}.items.${fId}.isFeatured`]: false,
            [`menu.${cId}.items.${fId}.updated_at`]: new Date(),
            [`menu.${cId}.items.${fId}.updated_by`]: user
        }
    }, {
        new: true
    })
    return food_document
}

const get_specific_food_details = async (restaurant_id, food_id)=>{
    var food_details = {}
    const food_document = await Menu.aggregate([
        {
            $unwind: "$menu"
        },
        {
            $unwind: "$menu.items"
        },
        {
            $group: {
                "_id": "$menu.items._id",
                "name": {
                    "$first": "$menu.items.fName"
                },
                "price": {
                    "$first": "$menu.items.price"
                },
                "rId": {
                    "$first": "$rId"}
                    ,
                "description": {
                    "$first": "$menu.items.description"
                },
                "cuisines": {
                    "$first": "$menu.items.cuisines"
                },
                "fType": {
                    "$first": "$menu.items.fType"
                },
                "images": {
                    "$first": "$menu.items.images"
                },
                "isVeg": {
                    "$first": "$menu.items.isVeg"
                }
            }
        }
    ])
    const index = food_document.findIndex((item)=>{
        return item["_id"] == food_id
    })
    const final_details = await Restaurants.populate(food_document, {
        "path": "rId",
        "select": "name"
    })
    const rating_reviews_document = await get_aggregation_rating(food_id)
    const overall_deatils = await get_final_rating(food_id)
    food_details["details"] = final_details[index]
    food_details["ratings"] = rating_reviews_document
    food_details["overall_rating"] =  Number.parseFloat(overall_deatils["overall"].toFixed(1)),
    food_details["overall_satisfaction"] = Number.parseFloat(overall_deatils["satisfaction"].toFixed(1)),
    food_details["overall_apetite"] = Number.parseFloat(overall_deatils["apetite"].toFixed(1))
    food_details["total_reviews"] = overall_deatils["total"]
    return food_details
}

const get_popular_food = async () => {
    const foods = await Menu.aggregate([
        {
            $unwind: "$menu"
        },  
        {
            $unwind: "$menu.items"
        },  
        {
            $group: {
                "_id": "$menu.items._id",
                "name": {
                    "$first": "$menu.items.fName"
                },
                "price": {
                    "$first": "$menu.items.price"
                },
                "rId": {
                    "$first": "$rId"
                },
                "images": {
                    "$first": "$menu.items.images"
                },
                "inorders": {
                    "$first": "$menu.items.inorders"
                }
            }
        },{
            $project: {
                "_id": "$_id",
                "name": "$name",
                "price": "$price",
                "restaurant": "$rId",
                "images": "$images",
                "inorders": {
                    "$size": "$inorders"
                }
            }
        },{
            $sort: {
                "inorders": -1
            }
        }
    ]).limit(15)
    return await Restaurants.populate(foods, {
        "path": "restaurant",
        "select": "name"
    })
}

const get_popular_food_of_restaurant = async (restaurant_id) => {
    const foods = await Menu.aggregate([
        {
            $unwind: "$menu"
        },  
        {
            $unwind: "$menu.items"
        },
        {
            $match: {
                "rId": restaurant_id
            }
        },
        {
            $group: {
                "_id": "$menu.items._id",
                "name": {
                    "$first": "$menu.items.fName"
                },
                "price": {
                    "$first": "$menu.items.price"
                },
                "rId": {
                    "$first": "$rId"
                },
                "images": {
                    "$first": "$menu.items.images"
                },
                "inorders": {
                    "$first": "$menu.items.inorders"
                }
            }
        },{
            $project: {
                "_id": "$_id",
                "name": "$name",
                "price": "$price",
                "restaurant": "$rId",
                "images": "$images",
                "inorders": {
                    "$size": "$inorders"
                }
            }
        },{
            $sort: {
                "inorders": -1
            }
        }
    ]).limit(15)
    return await Restaurants.populate(foods, {
        "path": "restaurant",
        "select": "name"
    })
}

const get_featured_food = async () => {
    const foods = await Menu.aggregate([
        {
            $unwind: "$menu"
        },
        {
            $unwind: "$menu.items"
        },
        {
            $match: {
                "menu.items.isFeatured": true
            }
        },
        {
            $group: {
                "_id": "$menu.items._id",
                "name": {
                    "$first": "$menu.items.fName"
                },
                "price": {
                    "$first": "$menu.items.price"
                },
                "isVeg": {
                    "$first": "$menu.items.isVeg"
                },
                "rId": {
                    "$first": "$rId"
                }
            }
        },{
            $project: {
                "_id":"$_id",
                "restaurant": "$rId",
                "name": "$name",
                "price": "$price",
                "isVeg": "$isVeg"
            }
        }
    ]).limit(20)
    return await Restaurants.populate(foods, {
        "path": "restaurant",
        "select": "name"
    })
}

const get_featured_food_of_restaurant = async (restaurant_id) => {
    var response = []
    const foods = await Menu.aggregate([
        {
            $unwind: "$menu"
        },
        {
            $unwind: "$menu.items"
        },
        {
            $match: {
                "menu.items.isFeatured": true,
                "rId": restaurant_id
            }
        },
        {
            $group: {
                "_id": "$menu.items._id",
                "name": {
                    "$first": "$menu.items.fName"
                },
                "price": {
                    "$first": "$menu.items.price"
                },
                "images": {
                    "$first": "$menu.items.images"
                },
                "isVeg": {
                    "$first": "$menu.items.isVeg"
                },
                "rId": {
                    "$first": "$rId"
                }
            }
        },{
            $project: {
                "_id":"$_id",
                "restaurant": "$rId",
                "name": "$name",
                "images": "$images",
                "price": "$price",
                "isVeg": "$isVeg"
            }
        }
    ]).limit(20)
    for(var i=0;i<foods.length;i++){
        var rating = 0;
        const rating_document = await get_destination_rating_review(foods[i]["_id"])
        if(rating_document.length > 0){
            for(var j=0;j<rating_document.length;j++){
                rating += rating_document[j]["rating"]
            }
            foods[i]["rating"] = Number.parseFloat((rating / rating_document.length).toFixed(1))
        } else {
            foods[i]["rating"] = Number.parseFloat((3).toFixed(1));
        }
        foods[i]["reviews"] = rating_document.length
    }
    return await Restaurants.populate(foods, {
        "path": "restaurant",
        "select": "name"
    })
}



const get_nearby_food = async (locality) => {
    const finalResponse = []
    const restaurants = await Restaurants.find({
        "locality": locality
    })
    for(var i=0;i<restaurants.length;i++){
        const restaurant_id = restaurants[i]["_id"]
        const foods = await Menu.aggregate([
            {
                $unwind: "$menu"
            },  
            {
                $unwind: "$menu.items"
            },

            {
                $match: {
                    "rId": `${restaurant_id}`
                }
            },
            {
                $group: {
                    "_id": "$menu.items._id",
                    "name": {
                        "$first": "$menu.items.fName"
                    },
                    "price": {
                        "$first": "$menu.items.price"
                    },
                    "rId": {
                        "$first": "$rId"
                    },
                    "images": {
                        "$first": "$menu.items.images"
                    },
                    "inorders": {
                        "$first": "$menu.items.inorders"
                    }
                }
            },{
                $project: {
                    "_id": "$_id",
                    "name": "$name",
                    "price": "$price",
                    "restaurant": "$rId",
                    "images": "$images",
                    "inorders": {
                        "$size": "$inorders"
                    }
                }
            },{
                $sort: {
                    "inorders": -1
                }
            }
        ])
        finalResponse.push(foods[0])
        finalResponse.push(foods[1])
    }
    return finalResponse
}


module.exports = {
    getFoodDetails,
    getRestaurantMenu,
    get_particular_food_details,
    update_inorder_content,
    get_popular_food,
    get_featured_food,
    get_nearby_food,
    get_featured_food_of_restaurant,
    get_popular_food_of_restaurant,
    get_specific_food_details,
    enable_featuring,
    enable_item,
    disable_featuring,
    disable_item
}