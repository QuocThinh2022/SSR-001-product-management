


const registerUser = (req, res, next) => {

    if (!req.body.fullname) {
        req.flash('error', 'fullname khong duoc de trong!');
        res.redirect('back');
        return ;
    }

    if (!req.body.email) {
        req.flash('error', 'email khong duoc de trong');
        res.redirect('back');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'mat khau khong duoc de trong');
        res.redirect('back');
        return;
    }
    next();
}

const loginUser = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'email khong duoc de trong');
        res.redirect('back');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'mat khau khong duoc de trong');
        res.redirect('back');
        return;
    }
    next();
}

const forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'email khong duoc de trong');
        res.redirect('back');
        return;
    }
    next();
}

function resetPassword(req, res, next) {
    const {password, confirmPassword} = req.body;

    if (!password) {
        req.flash('error', 'Mat khau khong duoc de trong')
        res.redirect('back')
        return ;
    }

    if (!confirmPassword) {
        req.flash('error', 'Vui long xac nhan lai mat khau')
        res.redirect('back')
        return ;
    }

    if (password != confirmPassword) {
        req.flash('error', 'Xac nhan mat khau khong trung khop')
        res.redirect('back')
        return ;
    }
    next()
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
}