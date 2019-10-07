const mongoose = require('mongose')
const Transaction = require('../modals/Transaction.js')
const { generate_unique_identifier } = require('./utils.service')

const create_transaction = async(purpose, amount, type, ip) => {
    const transaction_id = generate_unique_identifier(12)
    
}