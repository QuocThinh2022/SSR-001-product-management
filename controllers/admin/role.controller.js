const Role = require('../../models/role.model');

// [GET] /admin/roles 
async function index(req, res) {
    const roles = await Role.find({deleted: false});
    
    res.render('admin/pages/roles/index', {
        pageTitle: 'Danh sach nhom quyen',
        roles,
    })
}

module.exports = {
    index
}