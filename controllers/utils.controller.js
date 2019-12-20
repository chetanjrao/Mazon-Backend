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
    get_locality
} = require('../services/utils.service')

const create_city_controller = async (req, res, next) => {
    const name = req.body["name"]
    const images = req.body["im"]
}