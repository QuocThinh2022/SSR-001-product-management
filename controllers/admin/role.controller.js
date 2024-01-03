const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/roles 
async function index(req, res) {
    const roles = await Role.find({deleted: false});
    
    res.render('admin/pages/roles/index', {
        pageTitle: 'Danh sach nhom quyen',
        roles,
    })
}

// [GET] /admin/roles/create 
async function getCreate(req, res) {
    
    res.render('admin/pages/roles/create', {
        pageTitle: 'Tao moi nhom quyen',
    })
}

// [POST] /admin/roles/create 
async function createRole(req, res) {
    try {
        await new Role(req.body).save();
        req.flash('success', `Tao Role [${req.body.title}] thanh cong`);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/roles`)
    } catch {
        req.flash('error', `Tao Role [${req.body.title}] that bai`);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/roles`)
    }
}

// [GET] /admin/roles/edit/rid
async function getEdit(req, res) {
    try {
        const {rid} = req.params;
        const role = await Role.findById(rid);
        res.render(`admin/pages/roles/edit`, {
            pageTitle: 'Edit Role',
            role
        });
    } catch {
        req.flash('error', `Truy cap Role that bai`);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/roles`)
    }
}

// [PATCH] /admin/roles/edit/rid
async function editRole(req, res) {
    try {
        const {rid} = req.params;
        await Role.findByIdAndUpdate(rid, req.body);
        req.flash('success', `Edit Role [${req.body.title}] thanh cong`);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/roles`)
    } catch {
        req.flash('error', `Edit Role that bai`);
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/roles`)
    }
}

// [GET] /admin/roles/permisstions
async function getPermisstion(req, res) {
    const roles = await Role.find({deleted: false}).select('title');
    res.render(`admin/pages/roles/permisstion`, {
        pageTitle: 'Permisstion',
        roles,
    });
}

module.exports = {
    index,
    getCreate,
    createRole,
    getEdit,
    editRole,
    getPermisstion
}