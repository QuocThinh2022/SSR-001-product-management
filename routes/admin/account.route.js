
const router = require('express').Router();
const controller = require('../../controllers/admin/account.controller');
const upload = require('../../middlewares/admin/UploadCloudinary');

router.get('/', controller.index);
router.get('/create', controller.getCreate);
router.get('/edit/:aid', controller.getEdit);

router.post('/create', upload.single('avatar'), controller.createAccount);

router.patch('/edit/:aid', upload.single('avatar'), controller.editAccount);


module.exports = router;