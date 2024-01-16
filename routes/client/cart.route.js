const router = require('express').Router();

const controller = require('../../controllers/client/cart.controller');

router.get('/', controller.index);
router.get('/delete/:pid', controller.getDelete)
router.get('/update/:pid/:quantity', controller.getUpdate)

router.post('/add/:pid', controller.addProduct);


module.exports = router;
