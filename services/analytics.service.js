const Analytics = require("../models/Analytics")

const get_analytics = async (reference) => {
    const analytics = await Analytics.aggregate([
        {
            $match: {
                "reference": `${reference}`
            }
        },
        {
            $project: {
                "clicks": {
                    $size: "$clicks"
                },
                "inorders": {
                    $size: "$inorders"
                },
                "scans": {
                    $size: "$scans"
                },
                "bookings": {
                    $size: "$bookings"
                },
                "rating_reviews": {
                    $size: "$ratingReviews"
                }
            }
        }
    ])
    return analytics
}

const create_analytics = async (reference) => {
    const new_analytics_document = new Analytics({
        reference: reference,
        clicks: [],
        inorders: [],
        bookings: [],
        ratingReviews: [],
        scans: []
    })
    const new_analytics = await new_analytics_document.save()
    return new_analytics
}

const add_analytics = async (reference, parameter, user) => {
    const updated_document = await Analytics.findOneAndUpdate({
        "reference": reference
    }, {
        $push:{
            [`${parameter}`]: {
                user: `${user}`,
                time: new Date()
            }
        }
    })
    return updated_document
}

const find_analytics = async (reference) => {
    const analytics_document = await Analytics.findOne({
        "reference": reference
    })
    return analytics_document
}

module.exports = {
    get_analytics,
    create_analytics,
    add_analytics,
    find_analytics
}