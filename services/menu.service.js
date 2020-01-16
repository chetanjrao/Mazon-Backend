/*
 * Created on Tue Nov 05 2019
 *
 * Author - Chethan Jagannatha Kulkarni, CTO, Mazon Services Pvt. Ltd. 
 * Copyright (c) 2019 Mazon Services Pvt. Ltd.
 */
const Menu = require('../models/menu.model')

const get_restuarant_menu = async (restaurantID) => {

}

const create_menu = async (dish_id, rId, category, sub_category, price, images, created_by) => {
    const new_menu_document = await new Menu({
        dish_id: dish_id,
        rId: rId, //Suggestion restaurant
        category: category,
        sub_category: sub_category,
        price: price,
        images: images,
        created_by: created_by
    })
    const new_menu = await new_menu_document.save()
    return new_menu
}

const get_restaurants_based_on_dish = async (dish_id) => {
    const restaurants = await Menu.find({
        "dish_id": dish_id,
    }, "rId")
    return restaurants
}

const get_featured_menu = async () => {
    
}

const get_featured_restaurant_menu = async () => {

}



module.exports = {

}