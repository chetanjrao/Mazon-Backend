const Cuisines = require('../models/Cuisine')
const City = require('../models/City')
const Locality = require('../models/Locality')
const Facility = require('../models/Facility')
const PaymentMode = require('../models/PaymentMode')
const Payment = require('../models/Payment')

const generate_unique_identifier = (count) => {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < count; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generate_otp = (count) => {
    var result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < count; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const create_cuisine = async (name, images=[], created_by) => {
    const cuisine_document = new Cuisines({
        name: name,
        images: images,
        created_by: created_by
    })
    const new_cuisine = await cuisine_document.save()
    return new_cuisine
}

const create_city = async (name, images=[], created_by) => {
    const city_document = new City({
        name: name,
        images: images,
        created_by: created_by
    })
    const new_city = await city_document.save()
    return new_city
}

const create_facility = async (name, created_by) => {
    const facility_document = new Facility({
        name: name,
        created_by: created_by
    })
    const new_facility = await facility_document.save()
    return new_facility
}

const create_locality = async (name, images=[], city, created_by) => {
    const locality_document = new Locality({
        name: name,
        city: city,
        images: images,
        created_by: created_by
    })
    const new_locality = await locality_document.save()
    return new_locality
}

const get_city = async(city_id) => {
    const city = await City.findOne({
        "_id": city_id
    })
    return city
}

const get_locality = async(locality_id) => {
    const locality = await Locality.findOne({
        "_id": locality_id
    })
    return locality
}

const get_cuisine = async(cuisine_id) => {
    const cuisine = await Cuisines.findOne({
        "_id": cuisine_id
    })
    return cuisine
}

const get_facility = async(facility_id) => {
    const facility = await Facility.findOne({
        "_id": facility_id
    })
    return facility
}

const get_cities = async() => {
    const city = await City.find({ })
    return city
}

const get_localities = async() => {
    const localities = await Locality.find({})
    return localities
}

const get_cuisines = async() => {
    const cuisines = await Cuisines.find({})
    return cuisines
}

const get_facilities = async() => {
    const facilities = await Facility.find({})
    return facilities
}

const create_payment_mode = async(name, is_bank) => {
    const payment_mode_document = new PaymentMode({
        name: name,
        is_bank: is_bank
    })
    const new_payment_mode = await payment_mode_document.save()
    return new_payment_mode
}

const create_payment = async (name, payment_mode, payment_amount, ip, user_agent, created_by)=>{
    const payment_document = new Payment({
        name: name,
        payment_mode: payment_mode,
        payment_amount: payment_amount,
        ip: ip,
        user_agent: user_agent,
        created_by: created_by
    })
    const new_payment = await payment_document.save()
    return new_payment
}

const get_payment_modes = async () => {
    return await PaymentMode.find({})
}


module.exports = {
    generate_unique_identifier,
    generate_otp,
    create_city,
    create_cuisine,
    create_facility,
    create_locality,
    get_cities,
    get_city,
    get_cuisine,
    get_cuisines,
    get_facilities,
    get_facility,
    get_localities,
    get_locality,
    create_payment_mode,
    create_payment,
    get_payment_modes
}