
const router = require('express').Router()
const controller = require('../../controllers/admin/setting.controller')

const upload = require('../../middlewares/admin/UploadCloudinary');


router.get('/general', controller.getGeneral)

router.patch('/general', [upload.single('logo')], controller.general);


module.exports = router