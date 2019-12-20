const express = require("express")
const router = express.Router()
const {
    get_popular_food,
    get_featured_food,
    get_nearby_food
} = require("../services/menu.service")

router.route("/restaurants/filter").get(async (req, res, next)=>{
    const top_food = await get_popular_food()
    res.json(top_food)
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

module.exports = router