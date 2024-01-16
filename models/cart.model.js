
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ]
    },
    {timestamps: true}
)

module.exports = mongoose.model('Cart', cartSchema, 'carts')