
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const productCategoriesRouter = require('./productCategories.route');
const roleRouter = require('./role.route');
const accountRouter = require('./account.route');
const authRouter = require('./auth.route');
const myAccountRouter = require('./my-account.route');
const settingRouter = require('./setting.route')

const authMiddleware = require('../../middlewares/admin/auth.middleware');
const systemConfig = require('../../config/system');

const authController = require('../../controllers/admin/auth.controller')

module.exports = (app) => {
    const PATH_ADMIN = `/` + systemConfig.PREFIX_ADMIN;     
    app.get(PATH_ADMIN, authController.getLogin);

    app.use(PATH_ADMIN + '/dashboard', [authMiddleware.requireAuth], dashboardRouter);
    app.use(PATH_ADMIN + '/products', [authMiddleware.requireAuth], productRouter);
    app.use(PATH_ADMIN + '/product-categories', [authMiddleware.requireAuth], productCategoriesRouter);
    app.use(PATH_ADMIN + '/roles', [authMiddleware.requireAuth], roleRouter);
    app.use(PATH_ADMIN + '/accounts', [authMiddleware.requireAuth], accountRouter);
    app.use(PATH_ADMIN + '/my-account', [authMiddleware.requireAuth], myAccountRouter);
    app.use(PATH_ADMIN + '/settings', [authMiddleware.requireAuth], settingRouter);

    app.use(PATH_ADMIN + '/auth', authRouter);

}
