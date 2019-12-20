const {
    get_wallet_details,
} = require("../services/wallet.service")

const get_wallet_details_controller = async (req, res, next) =>{
    const reference = req.body["reference"]
    const wallet = await get_wallet_details(reference)
    if(wallet[0] != undefined){
        res.json(wallet)
    } else {
        res.status(404)
        res.json({
            "message": "No wallet found",
            "status": 404
        })
    }
}


module.exports = {
    "get_wallet_details": get_wallet_details_controller,
}