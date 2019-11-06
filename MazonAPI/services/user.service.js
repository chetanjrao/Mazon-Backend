const mongoose = require('mongoose')
const Users = require('../modals/User')

const get_user_details = async (userID) => {
    const user = await Users.findOne({
        "$and": [
            {
                "_id": userID
            },
            {
                "hasbeenDeactivated": false
            }
        ]
    })
    if(user["_id"] != undefined){
        return {
            "email": user["email"],
            "mobile": user["mobile"],
            "name": user["name"],
            "is_premium": user["isPremium"],
            "last_login_time": user["lastLoginTime"]
        }
    } else {
        const error = new Error("Invalid User Requested")
        error.status = 400
        throw error
    }
}

module.exports = {
    get_user_details
}