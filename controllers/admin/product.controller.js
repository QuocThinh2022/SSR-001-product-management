
const Products = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');

// [GET] /admin/products
const index = async (req, res) => {
    try {
        const isTrash = (req._parsedUrl.pathname == '/trash');
        let find = {deleted: false}
        if (isTrash)
            find = {deleted: true};
        // filter status
        let filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            find.status = req.query.status;
        }

        //search
        const objectSearch = searchHelper(req.query);
        if (req.query.keyword) {
            find.title = objectSearch.regex;
        }

        // pagination
        let initPagination = {
            currentPage: 1,
            limitItem: 4,
        }
        let countProducts = await Products.countDocuments(find);
        let objectPagination = paginationHelper(req.query, initPagination, countProducts);

        const products = await Products.find(find)
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItem)
            .sort({position: 'desc'});
        if (isTrash) {
            res.render('admin/pages/products/trash.pug', {
                pageTitle: 'page products',
                products,
                filterStatus,
                keyword: objectSearch.keyword,
                pagination: objectPagination,
            })
        } else {
            res.render('admin/pages/products/index.pug', {
                pageTitle: 'page products',
                products,
                filterStatus,
                keyword: objectSearch.keyword,
                pagination: objectPagination,
            })
        }
    } catch (error) {
        throw new Error(error);
    }
}

// [GET] /admin/products/edit/:pid
const getProductEdit = async (req, res) => {
    try {
        const {pid} = req.params;
        const product = await Products.findById(pid);
        res.render('admin/pages/products/edit.pug', {pageTitle: 'Edit Product', product})
    } catch(error) {
        req.flash('error', 'san pham nay khong ton tai!');
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    }
}

// [GET] /admin/products/detail/:pid
const getProductDetail = async (req, res) => {
    try {
        const {pid} = req.params;
        const product = await Products.findById(pid);
        res.render('admin/pages/products/detail.pug', {pageTitle: 'Detail Product', product})
    } catch(error) {
        req.flash('error', 'san pham nay khong ton tai!');
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    }
}



// [PATCH] /admin/products/change-status/:status/:pid
const changeStatus = async (req, res) => {
    try {
        const {status, pid} = req.params;
        await Products.findByIdAndUpdate(pid, {status}, {new: true});
        req.flash('success', 'Cap nhat trang thai thanh cong!');
        res.redirect('back');
    } catch (error) {
        throw new Error(error);
    }
}

// [PATCH] /admin/products/change-multi
const changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(', ');

        switch(type) {
            case 'active':
            case 'inactive':
                await Products.updateMany({_id: {$in: ids}}, {status: type});
                req.flash('success', `Cap nhat trang thai thanh cong: ${ids.length} ban ghi`);
                break;
            case 'change-position':
                for (const item of ids) {
                    const [id, position] = item.split('-');
                    await Products.findByIdAndUpdate(id, {position});
                }
                req.flash('success', `Thay doi vi tri thanh cong: ${ids.length} ban ghi`);
                break;
            case 'undo-all':
                await Products.updateMany({_id: {$in : ids}}, {deleted: false, undodAt: new Date()});
                req.flash('success', `Hoan tac thanh cong: ${ids.length} ban ghi`);
                break;
            case 'delete-all':
                await Products.updateMany({_id: {$in : ids}}, {deleted: true, deletedAt: new Date()});
                req.flash('success', `xoa thanh cong: ${ids.length} ban ghi`);
                break;
            case 'delete-trash-all':
                await Products.deleteMany({_id: {$in : ids}});
                req.flash('success', `xoa thanh cong: ${ids.length} ban ghi`);
                break;
            default:
                break;
        }

        res.redirect('back');
    } catch (error) {
        throw new Error(error);
    }
}

// [GET] /admin/products/create
const create = async(req, res) => {
    try {
        res.render('admin/pages/products/create.pug', {
            pageTitle: 'Create New Product'
        });
    } catch(error) {
        throw new Error(error)
    }
}

// [POST] /admin/products/create
const createProduct = async(req, res) => {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        if (req.body.position === '') {
            let count = await Products.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }

        const product = new Products(req.body);
        await product.save();
        
        req.flash('success', 'Tao san pham thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    } catch(error) {
        req.flash('error', 'Tao san pham KHONG thanh cong!')
        throw new Error(error)
    }
}

// [PATCH] /admin/products/edit/:pid
const editProduct = async(req, res) => {
    try {
        const {pid} = req.params;
        req.body.price = parseInt(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.position = parseInt(req.body.position);
        
        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }

        await Products.findByIdAndUpdate(pid, req.body);
        req.flash('success', 'Cap nhat san pham thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    } catch(error) {
        req.flash('error', 'Cap nhat san pham KHONG thanh cong!')
        throw new Error(error)
    }
}

// [PATCH] /admin/products/delete/:pid
const deleteItem = async (req, res) => {
    try {
        const {pid} = req.params;
        await Products.findByIdAndUpdate(pid, {deleted: true});
        req.flash('success', `xoa thanh cong ban ghi`);
        res.redirect('back');
    } catch (error) {
        throw new Error(error);
    }
}

// [PATCH] /admin/products/undo/:pid
const undoIem = async (req, res) => {
    try {
        const {pid} = req.params;
        await Products.findByIdAndUpdate(pid, {deleted: false});
        req.flash('success', 'Undo ban ghi thanh cong')
        res.redirect('back');
    } catch(error) {
        throw new Error(error)
    }
}

// [DELETE] /admin/products/delete-trash/:pid
const deleteTrashItem = async (req, res) => {
   try {
        const {pid} = req.params;
        await Products.findByIdAndDelete(pid);
        req.flash('success', 'Xoa ban ghi thanh cong');
        res.redirect('back');
   } catch (error) {
    throw new Error(error)
   }

}

module.exports = {
    index,
    changeStatus,
    changeMulti,
    create,
    createProduct,
    deleteItem,
    undoIem,
    deleteTrashItem,
    getProductEdit,    
    editProduct,
    getProductDetail, 
}