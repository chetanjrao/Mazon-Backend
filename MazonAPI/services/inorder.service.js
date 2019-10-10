const mongoose = require('mongoose')
const Inorder = require('../modals/Inorder')
const {
    getFoodDetails,
    get_particular_food_details
} = require('./menu.service')
const {
    get_restaurant_owner_details
} = require('./restaurant.service')
INORDER_EXCLUDED_PROJECTIONS = {"order_token": 0,  }
const {
    io
} = require('../helpers/root.helper')
var sockets = require('../helpers/sockets.store')

const place_inorder = async (restaurant_id, table_no, menu, order_reference, order_token, offer_applied, name, phone, email) => {
    const inorder_query = new Inorder({
        r_id: restaurant_id,
        r_table: table_no,
        menu: menu,
        order_date_time: new Date(),
        order_status: 1,
        order_reference: order_reference,
        order_token: order_token,
        offer_applied: offer_applied,
        name: name,
        phone: phone,
        email: email
    })
    const new_inorder = await inorder_query.save()
    if(new_inorder != undefined && new_inorder != {}){
        const user_socket = io.sockets.connected[sockets[`${email}`]]
        const partner_details = await get_restaurant_owner_details(restaurant_id)
        const partner_socket = io.sockets.connected[sockets[`${partner_details['restaurantEmail']}`]]
        if(user_socket != undefined){
            user_socket.emit('inorder-placed', `Your Inorder at ${partner_details['name']} at Table No. ${table_no} has been placed. Your reference id is ${order_reference}`)
        }
        if(partner_socket != undefined){
            partner_socket.emit('new-inorder', {
                "order_reference": order_reference 
            })
        }
        return true
    }
}

const show_inorder = async (order_reference) => {
    const inorder = await Inorder.findOne({
        "order_reference": order_reference
    }, {})
    return inorder
}

const finish_inorder = async (order_reference) => {
    
}

const edit_inorder = async (order_reference, items) => {

}

const add_payment = async (order_reference, payment_mode, amount) => {

}

const get_final_price = async (order_reference) => {
    const inorder = await show_inorder(order_reference)
    const calculated_amount = await calculate_amount(inorder["r_id"], inorder["items"])
}

const calculate_amount = async (restaurant_id, items) => {
    var amount = 0
    for(var i=0; i<items.length;i++){
        var food = await get_particular_food_details(restaurant_id, items[i]["_id"])
        var price = food["price"]
        var food_amount = Number.parseFloat(price) * Number.parseFloat(items[i]*quantity)
        amount += Number.parseFloat(food_amount)
    }
    return amount
}

module.exports = {
    calculate_amount,
    place_inorder,
    edit_inorder,
    add_payment,
    show_inorder,
    finish_inorder
}