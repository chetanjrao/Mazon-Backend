const {
    get_transaction,
    get_all_transactions
} = require("../services/transaction.service")

const get_transaction_controller = async (req, res, next) => {
    const transaction_reference = req.body["transaction_reference"]
    const transaction = await get_transaction(transaction_reference)
    if(transaction[0] != undefined){
        
    } else {
        res.status(404)
        res.json({
            "message": "No transactions found",
            "status": 404
        })
    }
}

const get_transactions_on_user = async(req, res, next) => {
    //Changes needed
    const user = req.body["user"]
    const transactions = await get_all_transactions(user)
    if(transactions.length > 0){
        req.json({
            "transactions": transactions,
            "status": 200
        })
    }else{
        res.status(404)
        res.json({
            "message": "No transactions were found",
            "status": 404
        })
    }
}

module.exports = {
    "get_transaction": get_transaction_controller,
    "get_partcular_transaction": get_transactions_on_user
}