/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const Menu = require('../modals/Menu')
const {
    check_restaurant,
    get_restaurant_owner_details
} = require('./restaurant.service')
const EXCLUDED_PROJECTIONS = { "menu.items.created_at": 0, "menu.items.updated_at": 0, "menu.items.updated_by": 0, "menu.items.created_by": 0  }

const getFoodDetails = async (food_id, restaurant_id) => {
    const food = await Menu.findOne({
        "rID": restaurant_id,
        "menu.items._id": food_id
    }, EXCLUDED_PROJECTIONS)
    return food
}

const getRestaurantMenu = async (restaurant_ID) => {
    const restaurant_menu = await Menu.findOne({
        "rId": restaurant_ID
    }, EXCLUDED_PROJECTIONS)
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


module.exports = {
    getFoodDetails,
    getRestaurantMenu,
    get_particular_food_details
}