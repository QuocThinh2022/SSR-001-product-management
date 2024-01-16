
const router = require('express').Router();
const controller = require('../../controllers/admin/role.controller');

router.get('/', controller.index);
router.get('/create', controller.getCreate);
router.get('/edit/:rid', controller.getEdit);
router.get('/permissions', controller.getPermission);
router.get('/detail/:rid', controller.getDetail);


router.post('/create', controller.createRole);

router.patch('/permissions', controller.updatePermissions);
router.patch('/edit/:rid', controller.editRole);

router.delete('/delete/:rid', controller.deleteRole);

module.exports = router;