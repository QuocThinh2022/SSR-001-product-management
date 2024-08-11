
const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')
const Cart = require('../../models/cart.model')

const md5 = require('md5')
const generateHelper = require('../../helpers/generate')
const sendMailHelper = require('../../helpers/sendMail');

// [GET] /user/register 
async function getRegister(req, res) {
    
    res.render(`client/pages/user/register`, {
        pageTitle: 'Dang ky tai khoan'
    })
}

// [POST] /user/register 
async function register(req, res) {
    const {fullname, email, password} = req.body;
    let user = await User.findOne({email});
    if (user) {
        req.flash('error', 'Email da ton tai')
        res.redirect('back')
    }

    req.body.password = md5(req.body.password)
    user = await new User(req.body).save()

    console.log(user)
    res.cookie('tokenUser', user.tokenUser)
    res.redirect('/')
}

// [GET] /user/login 
async function getLogin(req, res) {

    res.render('client/pages/user/login', {
        pageTitle: 'Login'
    })
}

// [POST] /user/login
async function login(req, res) {
    const {email, password} = req.body;

    const user = await User.findOne({email})
    if (!user) {
        req.flash('error', 'Email khong ton tai')
        res.redirect('back')
        return ;
    }

    if (md5(password) != user.password) {
        req.flash('error', 'Sai mat khau')
        res.redirect('back')
        return ;
    }

    if (user.status == 'inactive') {
        req.flash('error', 'Tai khoan dang bi khoa')
        res.redirect('back')
        return ;
    }
    
    res.cookie('tokenUser', user.tokenUser)
    await User.findByIdAndUpdate(user.id, {statusOnline: 'online'})
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id)
    })

    // const cart = await Cart.findOne({user_id: user.id});
    // if (!cart) {
        // luu user_id vao collection carts
    await Cart.findByIdAndUpdate(req.cookies.cartId, {user_id: user.id})
    // } else {
    //     console.log(req.cookies.cartId)
    //     console.log(cart.id)
    // }
    
    res.redirect('/')
}

// [GET] /user/logout 
async function getLogout(req, res) {
    res.clearCookie('tokenUser');
    const userId = res.locals.user.id;
    await User.findByIdAndUpdate(userId, {statusOnline: 'offline'})
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", userId)
    })
    res.redirect('/')
}

// [GET] /user/password/forgot
async function getForgotPassword(req, res) {


    res.render('client/pages/user/forgot-password', {
        pageTitle: 'Lay lai mat khau'
    })
}

// [POST] /user/password/forgot 
async function forgotPassword(req, res) {

    const email = req.body.email;
    
    const user = await User.findOne({email})
    if (!user) {
        req.flash('error', 'Email khong ton tai')
        res.redirect('back')
        return ;
    }

    // Tao ma OTP va luu OTP, email vao collection forgot-password
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email,
        otp
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gui ma OTP qua email cua user
    const subject = 'Ma OTP xac nhan lay lai mat khau';
    const html = `
        Ma OTP xac minh lay lai mat khau la: <b>${otp}</b>. Thoi han su dung la 6 phut.
        Luu y khong duoc de lo ma OTP.
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`)
}


// [GET] /user/password/otp 
async function getOtpPassword(req, res) {
    const email = req.query.email;

    res.render('client/pages/user/otp-password', {
        pageTitle: 'Nhap ma OTP',
        email,
    })
}

// [POST] /user/password/otp 
async function otpPassword(req, res) {
    const {email, otp} = req.body;

    const result = await ForgotPassword.findOne({email, otp})
    if (!result) {
        req.flash('error', 'OTP khong hop le')
        res.redirect('back')
        return ;
    }
    const user = await User.findOne({email});

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/user/password/reset');
}

// [GET] /user/password/reset 
async function getResetPassword(req, res) {


    res.render('client/pages/user/reset-password', {
        pageTitle: 'Doi mat khau'
    })
}

// [POST] /user/password/reset 
async function resetPassword(req, res) {
    try {
        const {password} = req.body;
        const tokenUser = req.cookies.tokenUser;

        await User.updateOne({tokenUser}, {password: md5(password)});

        res.redirect('/')
    } catch {

    }
}

async function getInfo(req, res) {
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({tokenUser}).select('-password');

    res.render('client/pages/user/info', {
        pageTitle: 'Thong tin tai khoan',
        user,
    })
}

module.exports = {
    getRegister,
    register,
    getLogin,
    login,
    getLogout,
    getForgotPassword,
    forgotPassword,
    getOtpPassword,
    otpPassword,
    getResetPassword,
    resetPassword,
    getInfo,

}