const Category = require('../models/category.model')

const get_category = async (category_id) => {
    const category_document = await Category.findOne({
        "_id": category_id
    })
    return category_document
}

module.exports = {
    get_category
}
