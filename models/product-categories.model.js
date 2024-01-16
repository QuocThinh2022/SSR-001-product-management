const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategoriesSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        parent_id: {
            type: String,
            default: ''
        },
        slug: {
            type: String,
            slug: 'title',
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        position: {
            type: Number,
            default : 0
        },
        thumbnail: {
            type: String,
            default: 'https://res-console.cloudinary.com/deqclwsve/thumbnails/v1/image/upload/v1700020857/Y2xkLXNhbXBsZS0y/grid_landscape'
        },
        status: {
            type: String,
            default: 'active'
        }
    },{
        timestamps: true
    }
)

module.exports = new mongoose.model('ProductCategory', productCategoriesSchema, 'product-categories');
