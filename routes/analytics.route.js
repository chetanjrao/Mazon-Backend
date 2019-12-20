const express = require("express")
const router = express.Router()
const {
    get_analytics,
    create_analytics,
    find_analytics,
    add_analytics
} = require("../services/analytics.service")

router.route("/:reference").get(async(req, res)=>{
    const reference = req.params["reference"]
    const analytics = await get_analytics(reference)
    res.json(analytics)
})

router.route("/:reference/update").patch(async(req, res)=>{
    const reference = req.params["reference"]
    const parameter = req.query["parameter"]
    const user = req.body["user"]
    const analytics_document = await find_analytics(reference)
    if(analytics_document == null){
        await create_analytics(reference)
        await add_analytics(reference, parameter, user)
    } else {
        await add_analytics(reference, parameter, user)
    }
    res.send("ok")
})

module.exports = router