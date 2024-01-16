const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        slug: 'title',
        unique: true
    },
    product_category_id: {
        type: String,
        default: ''
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: {
        type: String,
        default: 'https://res-console.cloudinary.com/deqclwsve/thumbnails/v1/image/upload/v1700020857/Y2xkLXNhbXBsZS0y/grid_landscape'
    },
    status: String,
    featured: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    createdBy: {
        account_id: String,
        createAt:{
            type: Date,
            default: Date.now
        }
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
})


module.exports = mongoose.model('Product', productSchema, 'products');
