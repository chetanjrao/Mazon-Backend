const Dish = require('../models/dish.model')

const create_dish = async (name, description, isVeg, created_by, reciepes=[], cuisines=[], ingredients=[], fType=[], categories=[]) => {
    const new_dish_document = new Dish({
        name: name,
        ingredients: ingredients,
        description: description,
        fType: fType,
        cuisines: cuisines,
        reciepes: reciepes,
        isVeg: isVeg,
        categories: [],
        created_by: created_by
    })
    const new_document = await new_dish_document.save()
    return new_document
}

const get_dish = async (dish_id) => {
    const dish_document = await Dish.findOne({
        "_id": dish_id
    })
    return dish_document
}

const get_dishes = async (query_string) => {
    const dish_documents = await Dish.find({
        "name": {
            $regex: query_string,
            $options: "i"
        }
    })
    return dish_documents
}

module.exports = {
    create_dish,
    get_dish,
    get_dishes
}