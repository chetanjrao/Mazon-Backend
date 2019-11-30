const Transactions = require('../models/Transaction.js')
const { generate_unique_identifier } = require('./utils.service')

const create_transaction = async(purpose, amount, type, ip, action_by, latitude, longitude, user_agent) => {
    const transaction_reference = generate_unique_identifier(16)
    while(validate_transaction(transaction_reference)){
        transaction_reference = generate_unique_identifier(16)
    }
    const transaction_message = purpose
    const transaction_type = type
    const transaction_ip = ip
    const transaction_amount = amount
    const transaction_action = action_by
    const transaction_user_agent = user_agent
    const transaction_document = new Transactions({
        reference: transaction_reference,
        message: transaction_message,
        type: transaction_type,
        ip: transaction_ip,
        amount: transaction_amount,
        coordinates: {
            latitude: latitude,
            longitude: longitude
        },
        action: transaction_action,
        user_agent: transaction_user_agent,

    })
    const new_transaction = await transaction_document.save()
    return new_transaction
}

const get_transaction = async (transaction_reference) => {
    const transaction = await Transactions.findOne({
        "reference": transaction_reference
    }, {
        "user_agent": 0,
        "ip": 0
    })
    if(transaction[0] != undefined){
        return transaction
    }
    return {}
}

const get_all_transactions = async(user) => {
    const transactions = await Transactions.find({
        "user": user
    }, {
        "user_agent": 0,
        "ip": 0
    })
    return transactions
}

const validate_transaction = async (transaction_reference) => {
    const transaction = await Transactions.findOne({
        "reference": transaction_reference
    })
    if(transaction[0] == undefined){
        return true
    }
    return false
}

module.exports = {
    create_transaction, 
    validate_transaction,
    get_transaction,
    get_all_transactions
}