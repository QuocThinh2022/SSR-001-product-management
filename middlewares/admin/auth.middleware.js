
const systemConfig = require('../../config/system');

const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

module.exports.requireAuth = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/auth/login`);
        return ;
    }

    const user = await Account.findOne({token});
    if (!user) {
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/auth/login`);
        return ;
    }

    const role = await Role.findById(user.role_id).select('title permissions');

    res.locals.user = user;
    res.locals.role = role;
    next();
}