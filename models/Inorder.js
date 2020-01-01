var mongoose  = require('mongoose')
const {
    resources
} = require("../helpers/dbHelper")
var Schema = mongoose.Schema

var inOrderSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    rId: {
        type: String,
        required: true
    },
    rTable: {
        type: Number,
        required: true
    },
    device_id: {
        type: [String],
        default: []
    },
    menu: [
        {
            cId: {
                type: String,
                required: true
            },
            fId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            isHalf: {
                type: Boolean,
                default: false
            }
        }
    ],
    order_date_time: {
        type: Date,
        default: new Date()
    },
    order_status: { 
        /*
             i) 1: Order Placed
            ii) 2: Order Accepted
            iii) 3: Order is ready
            iv) 4: Paid
           v) 5: Order Cancelled
        */
        type: Number,
        default: 1,
        required: true
    },
    order_token: {
        type: String,
        required: true
    },
    offer_applied: {
        type: String
    },
    payment_mode: {
        type: String
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    last_updated_by: {
        type: String
    },
    last_updated_at: {
        type: Date
    }
})

const InorderModel = resources.model('Inorder', inOrderSchema)

module.exports = InorderModel