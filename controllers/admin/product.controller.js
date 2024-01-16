
const Products = require('../../models/product.model');
const ProductCategories = require('../../models/product-categories.model');
const Account = require('../../models/account.model');

const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');

// [GET] /admin/products
// [GET] /admin/products/trash
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

        // sort
        let sort = {}
        if (req.query.sortKey) {
            let value = 'asc';
            if (req.query.sortValue == 'desc') {
                value = req.query.sortValue
            }
            sort[req.query.sortKey] = value;
        } else {
            sort = {position: 'desc'}
        }

        const products = await Products.find(find)
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItem)
            .sort(sort);

        for (const product of products) {
            const userCreate = await Account.findById(product.createdBy.account_id)
            if (userCreate)
                product.createdBy.accountFullName = userCreate.fullname;

            const userDelete = await Account.findById(product.deletedBy.account_id)
            if (userDelete)
                product.deletedBy.accountFullName = userDelete.fullname;
     
        }
        
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
        const category = await ProductCategories.findById(product.product_category_id);
        let categories = await ProductCategories.find({deleted: false});
        categories = createTree(categories);
        res.render('admin/pages/products/edit.pug', {pageTitle: 'Edit Product',
            product,
            category,
            categories
        })
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

        for (const obj of product.updatedBy) {
            const user = await Account.findById(obj.account_id);
            if (user) {
                obj.accountFullName = user.fullname;
            }
        }
        
        product.updatedBy = product.updatedBy.reverse();
        
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
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }

        switch(type) {
            case 'active':
            case 'inactive':
                await Products.updateMany({_id: {$in: ids}}, {
                    status: type,
                    $push: {updatedBy}
                });
                req.flash('success', `Cap nhat trang thai thanh cong: ${ids.length} ban ghi`);
                break;
            case 'change-position':
                for (const item of ids) {
                    const [id, position] = item.split('-');
                    await Products.findByIdAndUpdate(id, {
                        position,
                        $push: {updatedBy}
                    });
                }
                req.flash('success', `Thay doi vi tri thanh cong: ${ids.length} ban ghi`);
                break;
            case 'undo-all':
                await Products.updateMany({_id: {$in : ids}}, {
                    deleted: false, 
                    undodAt: new Date(),
                    $push: {updatedBy}
                });
                req.flash('success', `Hoan tac thanh cong: ${ids.length} ban ghi`);
                break;
            case 'delete-all':
                await Products.updateMany({_id: {$in : ids}}, {
                    deleted: true, 
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                    $push: {updatedBy}
                });
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
        let categories = await ProductCategories.find({deleted: false});
        categories = createTree(categories);
        res.render('admin/pages/products/create.pug', {
            pageTitle: 'Create New Product',
            categories
        });
    } catch(error) {
        
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

        req.body.createdBy = {
            account_id: res.locals.user.id
        }

        const product = new Products(req.body);
        await product.save();
        
        req.flash('success', 'Tao san pham thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    } catch(error) {
        req.flash('error', 'Tao san pham KHONG thanh cong!')
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

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }

        await Products.findByIdAndUpdate(pid, {
            ...req.body,
            $push: {updatedBy}
        });
        req.flash('success', 'Cap nhat san pham thanh cong!')
        res.redirect(`/${systemConfig.PREFIX_ADMIN}/products`)
    } catch(error) {
        req.flash('error', 'Cap nhat san pham KHONG thanh cong!')
    }
}

// [PATCH] /admin/products/delete/:pid
const deleteItem = async (req, res) => {
    try {
        const {pid} = req.params;
        await Products.findByIdAndUpdate(pid, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            }
        });
        req.flash('success', `xoa thanh cong ban ghi`);
        res.redirect('back');
    } catch (error) {
        req.flash('error', 'xoa ban ghi that bai');
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
        req.flash('error', 'Undo ban ghi that bai');
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
        req.flash('error', 'Xoa ban ghi that bai');
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