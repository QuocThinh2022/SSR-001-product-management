const router = require('express').Router();

const controller = require('../../controllers/admin/productCategories.controller');
const upload = require('../../middlewares/admin/UploadCloudinary');

router.get('/', controller.getCategories);
router.get('/create', controller.getCreate);

router.post('/create', [upload.single('thumbnail')],controller.createCategory);

module.exports = router;