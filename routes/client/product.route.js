
const router = require('express').Router();
const controller = require('../../controllers/client/product.controller');

router.get('/', controller.index);
router.get('/detail/:slugProduct', controller.getDetail);
router.get('/:slugCategory', controller.getCategory);

module.exports = router;