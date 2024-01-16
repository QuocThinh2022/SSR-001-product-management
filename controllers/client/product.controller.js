const Products = require('../../models/product.model');
const ProdcutCategory = require('../../models/product-categories.model');

const productsHelper = require('../../helpers/product');

// [GET] /products
const index = async (req, res) => {
    const products = await Products.find({
        deleted: false,
        status: 'active'
    }).sort({position: 'desc'});
    const newProducts = productsHelper.priceNewProducts(products);

    res.render('client/pages/products/index', {
        pageTitle: 'page Products',
        products: newProducts,
    });
}

// [GET] /products/detail/:slug
const getDetail = async(req, res) => {
    try {
        const {slugProduct} = req.params;
        const product = await Products.findOne({slug: slugProduct, deleted: false, status: 'active'});
        
        if (product.product_category_id) {
            const category = await ProdcutCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status: 'active'
            })
            product.category = category;
        }

        product.priceNew = productsHelper.priceNewProduct(product);

        res.render('client/pages/products/detail.pug', {
            pageTitle: 'detail product',
            product,
        });
    } catch(error) {
        res.redirect('/');
    }
}

// [GET] /products/:slugCategory 
async function getCategory(req, res) {
    try {
        const {slugCategory} = req.params; 
        const category = await ProdcutCategory.findOne({
            deleted: false,
            status: 'active',
            slug: slugCategory,
        }).select('id title')
        
        const getSubCategory = async (parentId) => {
            const subs = await ProdcutCategory.find({
                parent_id: parentId,
                status: 'active',
                deleted: false,
            }).select('id');
            let allSub = [...subs];
            for (const sub of subs) {
                const childs = await getSubCategory(sub.id);
                allSub = allSub.concat(childs);
            }
            return allSub;
        }
        let listSubCategory = await getSubCategory(category.id);
        listSubCategory = listSubCategory.map(item => item.id)

        const products = await Products.find({
            deleted: false,
            status: 'active',
            product_category_id: {$in: [category.id, ...listSubCategory]},
        }).sort({position: 'desc'});
        const newProducts = productsHelper.priceNewProducts(products);
    
        res.render('client/pages/products/index', {
            pageTitle: category.title,
            products: newProducts,
        });
    } catch {

    }
}

module.exports = {
    index,
    getDetail,
    getCategory,

}