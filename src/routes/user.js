const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const viewUser = require('../app/middlewares/viewUser');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const checkAdminLogin = require('../app/middlewares/checkAdminLogin');

router.get('/profile/:id', viewUser, userController.profile);
router.get('/info', checkUserLogin, userController.userInfo);
router.get('/manager', checkUserLogin, checkAdminLogin, userController.manager);
router.post('/loggin', userController.loggin);
router.post('/register', userController.register);
router.get('/', userController.index);

module.exports = router;