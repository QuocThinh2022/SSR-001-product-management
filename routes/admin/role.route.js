
const router = require('express').Router();
const controller = require('../../controllers/admin/role.controller');

router.get('/', controller.index);

module.exports = router;