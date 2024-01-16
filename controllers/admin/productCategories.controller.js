const ProductCategories = require('../../models/product-categories.model');
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');

// [GET] admin/product-categories
async function getCategories(req, res) {
    let categories = await ProductCategories.find({deleted: false});
    categories = createTree(categories);
    res.render('admin/pages/product-categories/index', {
        pageTitle: 'Categories',
        categories
    });
}

// [GET] admin/product-categories/create 
async function getCreate(req, res) {
    let categories = await ProductCategories.find({deleted: false}).select('title parent_id');
    categories = createTree(categories);
    res.render('admin/pages/product-categories/createCategory', {
        pageTitle: 'create category',
        categories
    });
}

// [POST] admin/product-categories/create
async function createCategory(req, res) {

    if (!req.body.title) {
        req.flash('error', 'Bat buoc nhap tieu de');
        return ;
    }

    if (req.body.position === '') {
        const countRecords = await ProductCategories.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
        req.body[req.file.fieldname] = req.file.path;
    }

    const category = new ProductCategories(req.body)
    await category.save();

    req.flash('success', `Tao thanh cong danh muc: ${req.body.title}`);
    res.redirect(`/${systemConfig.PREFIX_ADMIN}/product-categories`)
}

// [GET] admin/product-categories/edit/:pcid
async function getEdit(req, res) {
    const {pcid} = req.params;
    const category = await ProductCategories.findById(pcid, {deleted: false}, {new: true});
    let categories = await ProductCategories.find({deleted: false}).select('title parent_id');
    
    categories = createTree(categories);
    res.render('admin/pages/product-categories/editCategory', {
        category,
        categories
    })
}

// [PATCH] admin/product-categories/edit/:pcid
async function editCategory(req, res) {
    const {pcid} = req.params;
    req.body.position = parseInt(req.body.position);
    await ProductCategories.findByIdAndUpdate(pcid, req.body)
    
    req.flash('success', `Cap nhat thanh cong danh muc: ${req.body.title}`);
    res.redirect(`/${systemConfig.PREFIX_ADMIN}/product-categories`)
}

module.exports = {
    getCategories,
    getCreate,
    createCategory,
    getEdit,
    editCategory,


}