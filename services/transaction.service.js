const Transactions = require('../models/transaction.model')
const { generate_unique_identifier } = require('./utils.service')

const create_transaction = async(wallet, purpose, amount, type, ip, beneficiary, user, user_agent) => {
    const transaction_message = purpose
    const transaction_type = type
    const transaction_ip = ip
    const transaction_amount = amount
    const transaction_user_agent = user_agent
    const transaction_document = new Transactions({
        wallet: wallet,
        message: transaction_message,
        type: transaction_type,
        ip: transaction_ip,
        amount: transaction_amount,
        user: user,
        beneficiary: beneficiary,
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
    if(transaction == null){
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
    console.log(transaction)
    if(transaction == null){
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