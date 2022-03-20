const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const getUserInfo = require('../app/middlewares/getUserInfo');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const { uploadCloud } = require('../config/cloudinary/cloudinary.config');
const checkAdminLogin = require('../app/middlewares/checkAdminLogin');

router.patch('/profile/avatar/:id', uploadCloud.single('image'), getUserInfo, userController.updateAvartar);
router.patch('/profile/:id', getUserInfo, userController.updateInfo);
router.get('/profile/:id', userController.profile);
router.get('/manager', checkUserLogin, checkAdminLogin, userController.manager);
router.get('/banned', checkUserLogin, checkAdminLogin, userController.bannedUsers);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/reset-password', userController.restore);
router.post('/reset-password/:tokenRestore', userController.resetPassword);
router.post('/', getUserInfo, userController.index);

module.exports = router;