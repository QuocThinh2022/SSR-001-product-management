
const Account = require('../../models/account.model.js')
const md5 = require('md5');
const systemConfig = require('../../config/system');

// [GET] admin/my-account/index
async function index(req, res) {

    res.render('admin/pages/my-account/index', {
        pageTitle: 'Thong tin ca nhan'
    })
}

// [GET] admin/my-account/edit 
async function getEdit(req, res) {
    
    res.render('admin/pages/my-account/edit', {
        pageTitle: 'Chinh sua thong tin ca nhan'
    })
}

// [PATCH] admin/my-account/edit 
async function edit(req, res) {
    try {
        if (req.body.password)
            req.body.password = md5(req.body.password);
        else
            delete req.body.password;
        
        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }
        await Account.findByIdAndUpdate(res.locals.user.id, req.body);
        
        req.flash('success', 'Cap nhat tai khoan thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/my-account`)
    } catch {
        req.flash('error', 'Cap nhat tai khoan that bai!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/my-account`)
    }
}

module.exports = {
    index,
    getEdit,
    edit
}