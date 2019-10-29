var mongoose  = require('mongoose')
var Schema = mongoose.Schema

var inOrderSchema = new Schema({
    rId: {
        type: String,
        required: true
    },
    rTable: {
        type: Number,
        required: true
    },
    menu: [
        {
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
    order_reference: { 
        type: String,
        required: true
    },
    order_token: {
        type: String,
        required: true
    },
    offer_applied: {
        type: String// Offer Object ID applied
    },
    payment_mode: {
        type: String
    },
    is_paid: {
        type: Boolean,
        default: false
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
    }
})

const InorderModel = mongoose.model('Inorder', inOrderSchema)

module.exports = InorderModel