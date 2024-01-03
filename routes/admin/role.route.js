
const router = require('express').Router();
const controller = require('../../controllers/admin/role.controller');

router.get('/', controller.index);
router.get('/create', controller.getCreate);
router.get('/edit/:rid', controller.getEdit);
router.get('/permisstions', controller.getPermisstion);


router.post('/create', controller.createRole);

router.patch('/edit/:rid', controller.editRole);

module.exports = router;