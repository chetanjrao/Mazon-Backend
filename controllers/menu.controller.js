/*
 * Created on Sun Sep 15 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const {
    get_restuarant_menu,
    get_featured_food_of_restaurant,
    get_specific_food_details,
    enable_featuring,
    enable_item,
    disable_featuring,
    disable_item
} = require('../services/menu.service')
const Menu = require('../models/menu.model')

module.exports = {
    getRestaurantMenu: async (req, res, next) => {
        const restaurant_id = req.params["restaurantID"]
        const restaurantMenu = await get_restuarant_menu(restaurant_id)
        res.json(restaurantMenu)
    },
    getFoodDetails: async (req, res, next) => {
        
    },
    getFeaturedFood: async (req, res, next) => {
        const restaurant_id = req.params["restaurantID"]
        const featured_food = await get_featured_food_of_restaurant(restaurant_id)
        res.json(featured_food)
    },
    getParticularFood: async(req, res, next) => {
        const food_id = req.params["foodID"]
        const restaurant_id = req.params["restaurantID"]
        const food_details = await get_specific_food_details(restaurant_id, food_id)
        res.json(food_details)
    },
    enableItem: async (req, res, next) => {
        const fId = req.params["fId"]
        const cId = req.params["cId"]
        const restaurant_id = req.params["restaurantID"]
        const updated_document = await enable_item(fId, restaurant_id, cId, res.locals["user_id"])
        if(updated_document != null){
            res.send("ok")
        } else {
            res.status(500)
            res.json({
                "message": "Unable to update document",
                "status": 500
            })
        }
    },
    disableItem: async (req, res, next) => {
        const fId = req.params["fId"]
        const cId = req.params["cId"]
        const restaurant_id = req.params["restaurantID"]
        const updated_document = await disable_item(fId, restaurant_id, cId, res.locals["user_id"])
        if(updated_document != null){
            res.send("ok")
        } else {
            res.status(500)
            res.json({
                "message": "Unable to update document",
                "status": 500
            })
        }
    },
    enableFeaturing: async (req, res, next) => {
        const fId = req.params["fId"]
        const cId = req.params["cId"]
        const restaurant_id = req.params["restaurantID"]
        const featured_food = await get_featured_food_of_restaurant(restaurant_id);
        if(featured_food.length < 8){
            const updated_document = await enable_featuring(fId, restaurant_id, cId, res.locals["user_id"])
            if(updated_document != null){
                res.send("ok")
            } else {
                res.status(500)
                res.json({
                    "message": "Unable to update document",
                    "status": 500
                })
            }
        } else {
            res.status(201)
            res.json({
                "message": "Featuring limit exceeded",
                "status": 201
            })
        }
    },
    disableFeaturing: async (req, res, next) => {
        const fId = req.params["fId"]
        const cId = req.params["cId"]
        const restaurant_id = req.params["restaurantID"]
        const updated_document = await disable_featuring(fId, restaurant_id, cId, res.locals["user_id"])
        if(updated_document != null){
            res.send("ok")
        } else {
            res.status(500)
            res.json({
                "message": "Unable to update document",
                "status": 500
            })
        }
    },
    addMenu: async (req, res, next) => {
        const is_new = req.body["is_new"]
        const cuisines = req.body["cuisines"]
        const isVeg = req.body["is_veg"]
        const name = req.body["name"]
        const price = req.body["price"]
        const description = req.body["description"]
        const category_name = req.body["category_name"]
        const restaurant_id = req.body["restaurant_id"]
        const user = res.locals["user_id"]
        if(!is_new || is_new == null){
            const cId = req.body["cId"]
            const updated_document = await Menu.findOneAndUpdate({
                "rId": restaurant_id
            }, {
                $push: {
                    [`menu.${cId}.items`]: {
                        cuisines: cuisines,
                        isVeg: isVeg,
                        fType: [],
                        ingredients: [],
                        fName: name,
                        price: price,
                        description: description,
                        created_by: user,
                        isFeatured: false,
                        inorders: [],
                        images: [],
                        created_at: new Date()
                    }
                }
            })
            if(updated_document != null){
                res.send("ok")
            } else {
                res.status(500)
                res.json({
                    "message": "Unable to update document",
                    "status": 500
                })
            }
        } else {
            const updated_document = await Menu.findOneAndUpdate({
                "rId": restaurant_id
            }, {
                $push: {
                    "menu": {
                        "category": category_name,
                        "items": [{
                            cuisines: cuisines,
                            isVeg: isVeg,
                            fType: [],
                            ingredients: [],
                            fName: name,
                            price: price,
                            description: description,
                            created_by: user,
                            isFeatured: false,
                            inorders: [],
                            images: [],
                            created_at: new Date()
                        }]
                    }
                }
            })
            if(updated_document != null){
                res.send("ok")
            } else {
                res.status(500)
                res.json({
                    "message": "Unable to update document",
                    "status": 500
                })
            }
        }
    }
}

