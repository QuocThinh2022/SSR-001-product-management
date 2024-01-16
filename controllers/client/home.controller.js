const Product = require('../../models/product.model')
const productsHelper = require('../../helpers/product');

// [GET] /
async function index(req, res) {
    try {
        const productsFeatured = await Product.find({
            deleted: false,
            featured: '1',
            status: 'active'
        }).limit(4)
        const newProducts = productsHelper.priceNewProducts(productsFeatured);

        const productsNew = await Product.find({
            deleted: false,
            status: 'active'
        }).sort({position: 'desc'}).limit(4)
        const newProductsNew = productsHelper.priceNewProducts(productsNew);


        res.render('client/pages/home/index', {
            pageTitle: 'page Home',
            productsFeatured: newProducts,
            productsNew: newProductsNew
        });
    } catch {
        console.log('error index controller')
    }
}

module.exports = {
    index,
}