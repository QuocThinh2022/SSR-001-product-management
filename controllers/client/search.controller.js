
const Product = require('../../models/product.model');

const productsHeper = require('../../helpers/product');

// [GET] /search 
async function index(req, res) {
    try {
        const keyword = req.query.keyword;
        let newProduct = [];
        if (keyword) {
            const keywordRegex = new RegExp(keyword, 'i');

            const products = await Product.find({
                deleted: false,
                status: 'active',
                title: keywordRegex,
            })
            newProduct = productsHeper.priceNewProducts(products);
        }
        

        res.render(`client/pages/search/index`, {
            pageTitle: 'Ket qua tim kiem',
            keyword,
            products: newProduct,
        })
    } catch {

    }
}

module.exports = {
    index,


}