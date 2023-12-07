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
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: {
        type: String,
        default: 'https://res-console.cloudinary.com/deqclwsve/thumbnails/v1/image/upload/v1700020857/Y2xkLXNhbXBsZS0y/grid_landscape'
    },
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})


module.exports = mongoose.model('Product', productSchema, 'products');
