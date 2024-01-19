
const router = require('express').Router()
const controller = require('../../controllers/client/users.controller')



router.get('/not-friend', controller.getNotFriend);

module.exports = router;