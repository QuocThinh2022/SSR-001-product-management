
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model')

const productHelper = require('../../helpers/product')

// [GET] /checkout 
async function index(req, res) {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findById(cartId)
        
        cart.totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product_id).select('thumbnail title price slug discountPercentage')
            product.priceNew = productHelper.priceNewProduct(product)
            item.productInfo = product
            item.totalPrice = item.quantity * product.priceNew
            cart.totalPrice += item.totalPrice
        }
    
        res.render('client/pages/checkout/index', {
            pageTitle: 'checkout',
            cartDetail: cart
        })
    } catch {

    }
}

// [POST] /checkout/order 
async function order(req, res) {
    try{
        const cartId = req.cookies.cartId;
        const userInfo = req.body;

        const cart = await Cart.findById(cartId);

        let products = [];
        for (const product of cart.products) {
            const productInfo = await Product.findById(product.product_id).select('price discountPercentage')
            const objectProduct = {
                product_id: product.product_id,
                quantity: product.quantity,
                price: productInfo.price,
                discountPercentage: productInfo.discountPercentage,
            }
            products.push(objectProduct)
        }

        const objectOrder = {
            cart_id: cartId,
            userInfo,
            products
        }
        const order = await new Order(objectOrder).save();
        await Cart.findByIdAndUpdate(cartId, {
            products: []
        })
        
        for (const product of cart.products) {
            const productInfo = await Product.findById(product.product_id).select('stock')
            productInfo.stock -= product.quantity;
            await productInfo.save();
        }

        res.redirect(`/checkout/success/${order.id}`)
    } catch {

    }
}

// [GET] /checkout/success/:orderId 
async function getSuccess(req, res) {
    const {orderId} = req.params;
    const order = await Order.findById(orderId)
    
    order.totalPrice = 0;
    for (const product of order.products) {
        const productInfo = await Product.findById(product.product_id).select('title thumbnail')
        product.productInfo = productInfo;
        product.priceNew = productHelper.priceNewProduct(product);
        product.totalPrice = product.priceNew * product.quantity;
        order.totalPrice += product.totalPrice;
    }


    res.render('client/pages/checkout/success', {
        pageTitle: 'Dat hang thanh cong',
        order,
    })
}

module.exports = {
    index,
    order,
    getSuccess
}