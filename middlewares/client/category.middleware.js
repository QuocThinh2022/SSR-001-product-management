
const ProductCategory = require('../../models/product-categories.model');

const createTree = require('../../helpers/createTree');



module.exports.category = async (req, res, next) => {
    let productCategory = await ProductCategory.find({
        deleted: false
    }).select('title parent_id slug');

    res.locals.layoutCategoryProducts = createTree(productCategory);

    next();
}