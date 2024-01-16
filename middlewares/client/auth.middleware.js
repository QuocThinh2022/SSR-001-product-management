
const systemConfig = require('../../config/system');

const User = require('../../models/user.model')

module.exports.requireAuth = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (!tokenUser) {
        res.redirect(`/user/login`);
        return ;
    }

    const user = await User.findOne({tokenUser});
    if (!user) {
        res.redirect(`/user/login`);
        return ;
    }

    next();
}