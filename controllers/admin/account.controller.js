
const md5 = require('md5');

const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

// [GET] /admin/accounts 
async function index(req, res) {

    const accounts = await Account.find({deleted: false});
    for (const account of accounts) {
        const role = await Role.findById(account.role_id).select('title');
        account.role = role;
    }

    res.render('admin/pages/accounts/index', {
        pageTitle: 'Danh sach Tai khoan',
        accounts,
    })
}

// [GET] /admin/accounts/create 
async function getCreate(req, res) {
    
    const roles = await Role.find({deleted: false}).select('title');

    res.render('admin/pages/accounts/create', {
        pageTitle: 'Tao tai khoan',
        roles
    })
}

// [POST] /admin/accounts/create 
async function createAccount(req, res) {
    try {
        req.body.password = md5(req.body.password);
        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }
        await new Account(req.body).save();
        
        req.flash('access', 'Tao tai khoan thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/accounts`)
    } catch {
        req.flash('error', 'Tao tai khoan that bai!')
        res.redirect('back');
    }
}

// [GET] admin/accounts/edit/:aid
async function getEdit(req, res) {
    try {
        const {aid} = req.params;
        const account = await Account.findById(aid, {deleted: false});
        const roles = await Role.find({deleted: false}).select('title');

        res.render(`admin/pages/accounts/edit`, {
            pagaTitle: 'Edit Account',
            account,
            roles
        });
    } catch {
        res.redirect('back')
    }
}

async function editAccount(req, res) {
    try {
        const {aid} = req.params;
        if (req.body.password)
            req.body.password = md5(req.body.password);
        else
            delete req.body.password;

        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }
        
        const account = await Account.findByIdAndUpdate(aid, req.body);

        req.flash('success', 'Cap nhat tai khoan thanh cong')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/accounts`)
    } catch {
        req.flash('error', 'Cap nhat tai khoan that bai!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/accounts`)
    }
}


module.exports = {
    index,
    getCreate,
    createAccount,
    getEdit,
    editAccount,

}