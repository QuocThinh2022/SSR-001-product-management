const router = require('express').Router();
const controller = require('../../controllers/admin/auth.controller');

router.get('/login', controller.getLogin);
router.get('/logout', controller.logout)

router.post('/login', controller.login)

module.exports = router;