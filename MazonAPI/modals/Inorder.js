var mongoose  = require('mongoose')
var Schema = mongoose.Schema

var inOrderSchema = new Schema({
    rId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rTable: {
        type: Number,
        required: true
    },
    menu: [
        {
            fID: {
                type: String,
                required: true
            },
            fName: {
                type: String,
                required: true
            },
            veg: {
                type: Boolean,
                required: true
            },
            fQuantity: {
                type: Number,
                required: true
            },
            fPrice: {
                type: Number,
                required: true
            }
        }
    ],
    orderDateTime: {
        type:String,
        required: true
    },
    orderStatus: { 
        /*
             i) 1: Order Placed
            ii) 2: Order Accepted
            iv) 3: Order is ready
            vi) 4: Paid
           vii) 5: Order Cancelled
        */
        type: Number,
        default: 1,
        required: true
    },
    orderRefID: { 
        type: String,
        required: true
    },
    orderType: {
        type: Number,
        required: true,
        default: 1
    },
    orderToken: {
        type: String,
        required: true
    },
    offerApplied: {
        type: String// Offer Object ID applied
    },
    paymentMode: {
        type: String
    },
    isPaid: {
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