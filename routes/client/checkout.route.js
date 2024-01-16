const router = require('express').Router()

const controller = require('../../controllers/client/checkout.controller')

router.get('/', controller.index)
router.get('/success/:orderId', controller.getSuccess)

router.post('/order', controller.order)

module.exports = router