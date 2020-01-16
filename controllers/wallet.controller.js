const {
    get_wallet_details,
} = require("../services/wallet.service")
const ERROR_CODES = require('../helpers/constants.helper')

const get_wallet_details_controller = async (req, res, next) =>{
    const reference = req.body["reference"]
    const wallet = await get_wallet_details(reference)
    if(wallet[0] != undefined){
        res.json(wallet)
    } else {
        res.status(404)
        res.json({
            "message": "No wallet found",
            "status": 404,
            "error_code": ERROR_CODES.DOCUMENT_NOT_FOUND
        })
    }
}


module.exports = {
    "get_wallet_details": get_wallet_details_controller,
}