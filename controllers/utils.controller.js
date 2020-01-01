const {
    create_city,
    create_cuisine,
    create_facility,
    create_locality,
    get_cities,
    get_city,
    get_cuisine,
    get_cuisines,
    get_facilities,
    get_facility,
    get_localities,
    get_locality,
    create_payment,
    create_payment_mode
} = require('../services/utils.service')

const create_city_controller = async (req, res, next) => {
    const name = req.body["name"]
    const created_by = res.locals["user_id"]
    try{
        const new_city = await create_city(name,[],created_by)
        res.json({
            "message": "City created successfully",
            "status": 200
        })
    } catch(CITY_CREATION_ERROR) {
        res.status(500)
        res.json({
            "message": "CITY_CREATION_ERROR",
            "status": 500
        })
    }
}

const create_cuisine_controller = async (req, res, next) => {
    const name = req.body["name"]
    const created_by = res.locals["user_id"]
    try{
        const new_cuisine = await create_cuisine(name,[],created_by)
        res.json({
            "message": "Cuisine created successfully",
            "status": 200
        })
    } catch(CUISINE_CREATION_ERROR) {
        res.status(500)
        res.json({
            "message": "CUISINE_CREATION_ERROR",
            "status": 500
        })
    }
}

const create_facility_controller = async (req, res, next) => {
    const name = req.body["name"]
    const created_by = res.locals["user_id"]
    try{
        const new_facility = await create_facility(name, created_by)
        res.json({
            "message": "Facility created successfully",
            "status": 200
        })
    } catch(FACILITY_CREATION_ERROR) {
        res.status(500)
        res.json({
            "message": "FACILITY_CREATION_ERROR",
            "status": 500
        })
    }
}

const create_locality_controller = async (req, res, next) => {
    const name = req.body["name"]
    const created_by = res.locals["user_id"]
    try{
        const new_locality = await create_locality(name,[],created_by)
        res.json({
            "message": "Locality created successfully",
            "status": 200
        })
    } catch(LOCALITY_CREATION_ERROR) {
        res.status(500)
        res.json({
            "message": "LOCALITY_CREATION_ERROR",
            "status": 500
        })
    }
}

const get_city_controller = async (req, res, next) => {
    const name = req.body["name"]
    const created_by = res.locals["user_id"]
    //const new_city = await
}

const get_cuisine_controller = async (req, res, next) => {

}

const get_facility_controller = async (req, res, next) => {

}

const get_locality_controller = async (req, res, next) => {

}

const create_payment_mode_controller = async (req, res, next) => {
    const name = req.body["name"]
    const is_bank = req.body["is_bank"]
    try {
        const payment_mode = await create_payment_mode(name, is_bank)
        res.json({
            "message": "Payment Mode created succesfully",
            "status": 200
        })
    } catch (PAYMENT_MODE_CREATION_ERROR) {
        res.status(500)
        res.json({
            "message": "Failed to create payment mode",
            "status": 500
        })
    }
}

module.exports = {
    create_payment_mode_controller 
}