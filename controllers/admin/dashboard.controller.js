
const ProductCategory = require('../../models/product-categories.model')
const Product = require('../../models/product.model')
const Account = require('../../models/account.model')
const User = require('../../models/user.model')


// [GET] /admin/dashboard
const index = async (req, res) => {
    const statistic = {
        categoryProduct: {
            title: 'Danh muc san pham',
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            title: 'san pham',
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            title: 'Tai khoan admin',
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            title: 'tai khoan client',
            total: 0,
            active: 0,
            inactive: 0,
        }
    }
    statistic.categoryProduct.total = await ProductCategory.countDocuments({deleted: false})
    statistic.categoryProduct.active = await ProductCategory.countDocuments({deleted: false, status: 'active'})
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({deleted: false, status: 'inactive'})
    
    statistic.product.total = await Product.countDocuments({deleted: false})
    statistic.product.active = await Product.countDocuments({deleted: false, status: 'active'})
    statistic.product.inactive = await Product.countDocuments({deleted: false, status: 'inactive'})
    
    statistic.account.total = await Account.countDocuments({deleted: false})
    statistic.account.active = await Account.countDocuments({deleted: false, status: 'active'})
    statistic.account.inactive = await Account.countDocuments({deleted: false, status: 'inactive'})

    statistic.user.total = await User.countDocuments({deleted: false})
    statistic.user.active = await User.countDocuments({deleted: false, status: 'active'})
    statistic.user.inactive = await User.countDocuments({deleted: false, status: 'inactive'})

    res.render('admin/pages/dashboard/index', {
        pageTitle: 'page dashboard',
        statistic
    });
}

module.exports = {
    index,
}