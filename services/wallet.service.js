const Wallets = require("../models/wallet.model")
const crypto = require('crypto')
const {
    create_transaction
} = require('./transaction.service')
const creditcard = require('creditcard-generator')

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

const credit_points_to_wallet = async (reference, points) => {
    const wallet = await Wallets.findOne({
        "u_id": reference
    })
    const updated_points = wallet["wallet_points"] + points
    const new_document = await wallet.updateOne({
        $set: {
            "wallet_points": updated_points
        }
    })
    return new_document
}

const debit_points_to_wallet = async (reference, transaction_reference, points) => {
    const wallet = await Wallets.findOne({
        "u_id": reference
    })
    if(wallet["wallet_points"] >= 0){
        const updated_points = wallet["wallet_points"] - points
        const new_document = await wallet.updateOne({
            $set: {
                "wallet_points": updated_points
            }
        })
        return new_document
    }
    return null
}

const create_wallet = async (user, ip, user_agent) => {
    const card_no = creditcard.GenCC()
    console.log(card_no)
    const new_wallet_document = new Wallets({
        u_id: user,
        card_no: card_no[0],
        wallet_points: 100
    })
    const new_wallet = await new_wallet_document.save()
    await create_transaction(new_wallet["_id"], "New Account Registration", 100, 1, ip, "Mazon Technologies Pvt. Ltd.", user, user_agent)
    return new_wallet
}

module.exports = {
    get_wallet_details,
    credit_points_to_wallet,
    debit_points_to_wallet,
    get_wallet_based_user,
    create_wallet
}