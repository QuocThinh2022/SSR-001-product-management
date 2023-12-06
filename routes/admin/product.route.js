

const router = require('express').Router();
const multer = require('multer');

const productController = require('../../controllers/admin/product.controller');
const storageMulterHelper = require('../../helpers/storageMulter');
const validateProduct = require('../../validates/admin/product.validate');
const storage = storageMulterHelper();

const upload = multer({storage: storage});

router.get('/', productController.index);
router.get('/trash', productController.index);
router.get('/create', productController.create);
router.get('/edit/:pid', productController.getProductEdit)
router.get('/detail/:pid', productController.getProductDetail)


router.post('/create', [upload.single('thumbnail'), validateProduct.createProduct], productController.createProduct);

router.patch('/change-multi', productController.changeMulti);
router.patch('/edit/:pid', [upload.single('thumbnail'), validateProduct.createProduct], productController.editProduct);
router.patch('/delete/:pid', productController.deleteItem);
router.patch('/undo/:pid', productController.undoIem);
router.patch('/change-status/:status/:pid', productController.changeStatus);

router.delete('/delete-trash/:pid', productController.deleteTrashItem);


module.exports = router;