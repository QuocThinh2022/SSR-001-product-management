
const router = require('express').Router();
const controller = require('../../controllers/client/search.controller.js')

router.get('/', controller.index);

module.exports = router;