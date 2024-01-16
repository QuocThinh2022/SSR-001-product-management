const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.cookies.cartId) {
            console.log('Khong co cookies')
            const cart = await new Cart().save();
            const expiresTime = 1000 * 60 * 60 *24 * 365;
            res.cookie('cartId', cart.id, {
                expires: new Date(Date.now() + expiresTime)
            });
            
        } else {
            const cart = await Cart.findById(req.cookies.cartId)
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)
            res.locals.miniCart = cart;
        }

        next();
    } catch {

    }
}