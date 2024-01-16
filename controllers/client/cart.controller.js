
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product')

// [POST] /cart/add/:pid
async function addProduct(req, res) {
    try {
        const cartId = req.cookies.cartId;
        const {pid} = req.params;
        const quantity = req.body.quantity;

        const product = await Product.findById(pid).select('stock');
        
        const cart = await Cart.findById(cartId);

        const productItem = cart.products.find(item => item.product_id == pid);

        if (productItem) {
            const newQuantity = Math.min(product.stock, productItem.quantity + parseInt(quantity));
            await Cart.updateOne({
                _id: cartId,
                'products.product_id': pid,
            }, {
                'products.$.quantity': newQuantity,
            })
        } else {
            await Cart.findByIdAndUpdate(cartId, {$push: {products: {product_id: pid, quantity}}})
        }
        
        req.flash('success', 'Them san pham vao gio hang thanh cong!')
        res.redirect('back')
    } catch {
        console.log('error cart.addProduct')
        res.redirect('back')
    }
}

// [GET] /cart 
async function index(req, res) {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId)
    
    if (cart){
        cart.totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product_id).select('thumbnail title price slug discountPercentage stock')
            product.priceNew = productHelper.priceNewProduct(product)
            item.productInfo = product
            item.totalPrice = item.quantity * product.priceNew
            cart.totalPrice += item.totalPrice
        }
    }
    
    res.render('client/pages/cart/index', {
        pageTitle: 'Cart',
        cartDetail: cart
    })
}

// [GET] /cart/delete/:pid 
async function getDelete(req, res) {
    const {pid} = req.params;
    const cartId = req.cookies.cartId;

    // code javascript
    // const cart = await Cart.findById(cartId).select('products')
    // cart.products = cart.products.filter(product => product.product_id != pid)
    // await cart.save()

    // code mongodb 
    await Cart.findByIdAndUpdate(cartId, {
        $pull: {products: {product_id: pid}}
    })

    req.flash('success', 'Xoa thanh cong san pham')
    res.redirect('back')
}

// [GET] /cart/update/:pid/:quantity 
async function getUpdate(req, res) {
    const {pid} = req.params;
    const cartId = req.cookies.cartId;
    const product = await Product.findById(pid).select('stock');
    const quantity = Math.min(req.params.quantity, product.stock);

    await Cart.updateOne(
        {
            _id: cartId,
            'products.product_id': pid
        },
        {
            'products.$.quantity': quantity
        }
    )

    res.redirect('back')
}

module.exports = {
    addProduct,
    index,
    getDelete,
    getUpdate

}