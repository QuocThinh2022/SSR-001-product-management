
const router = require('express').Router()
const controller = require('../../controllers/client/user.controller')

const validate = require('../../validates/client/user.validate')
const authMiddleware = require('../../middlewares/client/auth.middleware')


router.get('/register', controller.getRegister);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/password/forgot', controller.getForgotPassword);
router.get('/password/otp', controller.getOtpPassword);
router.get('/password/reset', controller.getResetPassword);
router.get('/info', [authMiddleware.requireAuth], controller.getInfo)

router.post('/register', [validate.registerUser], controller.register);
router.post('/login', [validate.loginUser], controller.login);
router.post('/password/forgot', [validate.forgotPassword], controller.forgotPassword);
router.post('/password/otp', controller.otpPassword);
router.post('/password/reset', [validate.resetPassword], controller.resetPassword)

module.exports = router;