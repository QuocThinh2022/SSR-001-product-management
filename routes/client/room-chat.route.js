const router = require('express').Router()
const controller = require('../../controllers/client/room-chat.controller')


router.get('/', controller.index)
router.get('/create', controller.getCreate)

router.post('/create', controller.create)

module.exports = router;