
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const productCategoriesRouter = require('./productCategories.route');
const roleRouter = require('./role.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = `/` + systemConfig.PREFIX_ADMIN;
    app.use(PATH_ADMIN + '/dashboard', dashboardRouter);
    app.use(PATH_ADMIN + '/products', productRouter);
    app.use(PATH_ADMIN + '/product-categories', productCategoriesRouter);
    app.use(PATH_ADMIN + '/roles', roleRouter);
}
