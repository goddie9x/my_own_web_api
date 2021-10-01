const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const { uploadCloud } = require('../config/cloudinary/cloudinary.config');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const checkModLogin = require('../app/middlewares/checkModLogin');

router.get('/notPermission', siteController.notPermission);
router.get('/loginSessionExpired', siteController.loginSessionExpired);
router.get('/404', siteController.notFound);
router.get('/500', siteController.errorServer);
router.post('/cloudinary-upload', checkUserLogin, uploadCloud.single('upload'), siteController.cloudinary);
router.delete('/images/:image', checkModLogin, siteController.cloudinaryDelete);
router.get('/images', siteController.images);
router.get('/search', siteController.search);
router.get('/game', siteController.game);
router.get('/room-chat', siteController.roomChat);
router.get('/loginAccess', siteController.loginAccess);
router.get('/', siteController.index);

module.exports = router;