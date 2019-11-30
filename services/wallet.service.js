const Wallets = require("../models/Wallet.js")

const get_wallet_details = async (reference) => {
    const wallet = await Wallets.findOne({
        "w_id": reference
    })
    return wallet
}

const get_wallet_based_user = async (user) => {
    const wallet = await Wallets.findOne({
        "u_id": user
    })
    return wallet
}

const credit_points_to_wallet = async (reference, transaction_reference, points) => {
    const wallet = await Wallets.findOne({
        "w_id": reference
    })
    const updated_points = wallet["wallet_points"] + points
    const new_document = await wallet.updateOne({
        $set: {
            "wallet_points": updated_points,
            "history": {
                $push: transaction_reference
            },
            "last_transaction_time": new Date()
        }
    })
    return new_document
}

const debit_points_to_wallet = async (reference, transaction_reference, points) => {
    const wallet = await Wallets.findOne({
        "w_id": reference
    })
    if(wallet["wallet_points"] >= 0){
        const updated_points = wallet["wallet_points"] - points
        const new_document = await wallet.updateOne({
            $set: {
                "wallet_points": updated_points,
                "history": {
                    $push: transaction_reference
                },
                "last_transaction_time": new Date()
            }
        })
        return new_document
    }
    return {}
}

module.exports = {
    get_wallet_details,
    credit_points_to_wallet,
    debit_points_to_wallet,
    get_wallet_based_user
}