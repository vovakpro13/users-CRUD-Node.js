const { Router } = require('express');

const { authValidator: { logIn, resetPasswordBody } } = require('../validators');
const { authMiddleWare, wareGenerator } = require('../middlewares');
const { authController } = require('../controllers');
const {
    authKeywords: { REFRESH, RESET },
    dynamicParams: {
        DB_KEYS: { ACTIVATION_CODE },
        PARAM_NAMES: { LINK },
        REQUEST_OBJECTS
    }
} = require('../constants');

const router = new Router();

router.get('/activate/:link',
    wareGenerator.chekRecordByDynamicParam(LINK, REQUEST_OBJECTS.PARAMS, ACTIVATION_CODE),
    authController.activate);

router.post('/',
    wareGenerator.chekRequestValid(REQUEST_OBJECTS.BODY, logIn),
    authMiddleWare.isLoginOrEmailExist,
    authMiddleWare.isEmailActivated,
    authController.logIn);

router.post('/refresh',
    authMiddleWare.checkToken(REFRESH),
    authController.refresh);

router.post('/reset',
    wareGenerator.chekRequestValid(REQUEST_OBJECTS.BODY, resetPasswordBody),
    authMiddleWare.checkToken(RESET),
    authController.changePassword);

router
    .use(authMiddleWare.checkToken())
    .get('/reset', authController.confirmReset)
    .post('/logout', authController.logOut);

module.exports = router;
