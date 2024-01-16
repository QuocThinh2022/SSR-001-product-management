
const router = require('express').Router();
const controller = require('../../controllers/admin/my-account.controller')
const upload = require('../../middlewares/admin/UploadCloudinary');


router.get('/', controller.index);
router.get('/edit', controller.getEdit);

router.patch('/edit', upload.single('avatar'), controller.edit)

module.exports = router;