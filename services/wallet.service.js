const Wallets = require("../models/Wallet.js")
const WalletTokens = require('../models/WalletToken')
const crypto = require('crypto')
const {
    create_transaction
} = require('./transaction.service')

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
        "_id": reference
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


const validate_wallet_access_token = async (wallet, token, user) => {
    const wallet_token = await WalletTokens.findOne({
        wallet: wallet,
        user: user,
        token: token
    })
    if(wallet_token != null){
        const expiry = wallet_token["expiry"]
        const now = new Date()
        if(now < expiry){
            return true
        }
        return false
    }
    return false
}

const create_wallet_access_token = async (user, wallet) => {
    const random_token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    now.setDate(now.getDate() + 60)
    const expiry = new Date(now)
    const new_wallet_token_document = new WalletTokens({
        user: user,
        wallet: wallet,
        token: random_token,
        expiry: expiry,
    })
    const new_wallet_token = await new_wallet_token_document.save()
    return new_wallet_token
}

const create_wallet = async (user, ip, latitude, longitude, user_agent) => {
    const new_transaction_document = await create_transaction("New Account Registration", 100, 1, ip, user, latitude, longitude, user_agent)
    const new_wallet_document = new Wallets({
        u_id: user,
        wallet_points: 100,
        history: [new_transaction_document["_id"]],
        last_transaction_time: new Date()
    })
    const new_wallet = await new_wallet_document.save()
    if(new_wallet != null){
        new_transaction_document.updateOne({
            $set: {
                is_op_success: true
            }
        })
    }
    return new_wallet
}

module.exports = {
    get_wallet_details,
    credit_points_to_wallet,
    debit_points_to_wallet,
    get_wallet_based_user,
    validate_wallet_access_token,
    create_wallet_access_token,
    create_wallet
}