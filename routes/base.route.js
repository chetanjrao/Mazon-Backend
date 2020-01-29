const express = require("express")
const router = express.Router()
const {
    get_popular_food,
    get_featured_food,
    get_nearby_food
} = require("../services/menu.service")
const {
    get_trending,
    get_suggestions,
    get_featured,
    get_searched_dish
} = require('../services/trending.service')
const {
    get_dishes,
    get_dish_details
} = require('../services/dish.service')
const {
    get_restaurants,
    get_searched_restaurants,
    get_most_visited_restaurants,
    featured_restaurants,
    get_top_restaurants
} = require('../services/restaurant.service')

router.route("/restaurants/filter").get(async (req, res, next)=>{
    const top_food = await get_popular_food()
    res.json(top_food)
})

router.route("/visited/restaurants").get(async (req, res, next)=>{
    const most_visited = await get_most_visited_restaurants()
    res.json(most_visited)
})

router.route("/top/restaurants").get(async (req, res, next)=>{
    const most_visited = await get_top_restaurants()
    res.json(most_visited)
})

router.route("/featured/restaurants").get(async (req, res, next)=>{
    const most_visited = await featured_restaurants()
    res.json(most_visited)
})

router.route("/foods/filter").get(async (req, res, next)=>{
    const filter_parameter = req.query["filter"]
    switch(filter_parameter){
        case "top":
            const top_food = await get_popular_food()
            res.json(top_food)
            break;
        case "featured":
            const featured_food = await get_featured_food()
            res.json(featured_food)
            break;
        case "nearby":
            const locality = req.query["locality"]
            const nearby_food = await get_nearby_food(locality)
            res.json(nearby_food)
    }
})

router.route("/trending/foods").get(async (req, res, next)=>{
    const latitude = req.query["latitude"]
    const longitude = req.query["longitude"]
    const trending_document = await get_trending(latitude, longitude)
    res.json(trending_document)
})

router.route("/suggestions/foods").get(async (req, res, next)=>{
    const suggestions_document = await get_suggestions()
    res.json(suggestions_document)
})

router.route("/featured/foods").get(async (req, res, next)=>{
    const featured_document = await get_featured()
    res.json(featured_document)
})

router.route("/search/foods").get(async (req, res, next)=>{
    const search = req.query["query"]
    const user = req.query["user"]
    const searched_document = await get_searched_dish(search, user)
    res.json(searched_document)
})

router.route("/search/restaurants").get(async (req, res, next)=>{
    const search = req.query["query"]
    const searched_document = await get_searched_restaurants(search)
    res.json(searched_document)
})

router.route("/search/utils/dishes").get(async (req, res, next)=>{
    const search = req.query["query"]
    const searched_document = await get_dishes(search)
    res.json(searched_document)
})

router.route("/search/utils/restaurants").get(async (req, res, next)=>{
    const search = req.query["query"]
    const searched_document = await get_restaurants(search)
    res.json(searched_document)
})

router.route("/dishes/:dishID").get(async(req, res, next)=>{
    const dish_id = req.params["dishID"]
    const dish_data = await get_dish_details(dish_id)
    res.json(dish_data)
})

module.exports = router