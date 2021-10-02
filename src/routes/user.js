const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const viewUser = require('../app/middlewares/viewUser');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const checkAdminLogin = require('../app/middlewares/checkAdminLogin');

router.patch('/profile/:id', viewUser, userController.userUpdateInfo);
router.get('/profile/:id', viewUser, userController.profile);
router.get('/manager', checkUserLogin, checkAdminLogin, userController.manager);
router.get('/banned', checkUserLogin, checkAdminLogin, userController.bannedUsers);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/', userController.index);

module.exports = router;