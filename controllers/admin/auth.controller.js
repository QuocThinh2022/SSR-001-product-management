
const Account = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');

// [GET] admin/auth/login 
async function getLogin(req, res) {
    if (req.cookies.token) {
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/dashboard`)
        return ;
    }

    // res.send('ok')
    res.render(`admin/pages/auth/login`, {
        pageTitle: 'Dang nhap'
    });
}

async function login(req, res) {
    const {email, password} = req.body;
    let find = {
        deleted: false,
        email
    }
    const user = await Account.findOne(find).select('token password status');
    
    if (!user) {
        req.flash('error', 'Email khong ton tai!');
        res.redirect('back');
    } else if (md5(password) != user.password) {
        req.flash('error', 'Sai mat khau')
        res.redirect('back')
    } else if (user.status == 'inactive') {
        req.flash('error', 'Tai khoan dang bi khoa')
        res.redirect('back')
    } else {
        res.cookie('token', user.token);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/dashboard`)
    }
    
}

async function logout(req, res) {
    res.clearCookie('token');
    res.redirect(`/${systemConfig.PREFIX_ADMIN}/auth/login`);
}


module.exports = {
    getLogin,
    login, 
    logout

}