const router = require('express').Router();

const controller = require('../../controllers/admin/productCategories.controller');
const upload = require('../../middlewares/admin/UploadCloudinary');

router.get('/', controller.getCategories);
router.get('/create', controller.getCreate);
router.get('/edit/:pcid', controller.getEdit);

router.post('/create', [upload.single('thumbnail')],controller.createCategory);

router.patch('/edit/:pcid', [upload.single('thumbnail')], controller.editCategory);

module.exports = router;