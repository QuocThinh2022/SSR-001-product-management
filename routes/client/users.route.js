
const router = require('express').Router()
const controller = require('../../controllers/client/users.controller')



router.get('/not-friend', controller.getNotFriend);
router.get('/request', controller.getRequest);
router.get('/accept', controller.getAccept);
router.get('/friends', controller.getFriends);

module.exports = router;