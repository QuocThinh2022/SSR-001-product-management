const Products = require('../../models/product.model');


// [GET] /products
const index = async (req, res) => {
    const products = await Products.find({
        deleted: false,
        status: 'active'
    }).sort({position: 'desc'});
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed();
        return item;
    })

    res.render('client/pages/products/index', {
        pageTitle: 'page Products',
        products: newProducts,
    });
}

// [GET] /products/detail/:slug
const detail = async(req, res) => {
    try {
        const {slug} = req.params;
        const product = await Products.findOne({slug, deleted: false, status: 'active'});
        res.render('client/pages/products/detail.pug', {
            pageTitle: 'detail product',
            product
        });
    } catch(error) {
        res.redirect('/');
    }
}

module.exports = {
    index,
    detail
}