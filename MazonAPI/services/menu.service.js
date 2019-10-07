const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/dbHelper')
const Menu = require('../modals/Menu')
const {
    check_restaurant
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
    const menu = restaurant_menu["menu"]
    return menu
}

const get_particular_food_details = async (restaurant_id, food_id) => {
    const food = await Menu.findOne({
        "rID": restaurant_id,
        "menu.items._id": food_id
    })
    return food
}


module.exports = {
    getFoodDetails,
    getRestaurantMenu,
    get_particular_food_details
}