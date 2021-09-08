const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.get('/notPermission', siteController.notPermission);
router.get('/loginSessionExpired', siteController.loginSessionExpired);
router.get('/404', siteController.notFound);
router.get('/500', siteController.errorServer);
router.get('/search', siteController.search);
router.get('/game', siteController.game);
router.get('/room-chat', siteController.roomChat);
router.get('/loginAccess', siteController.loginAccess);
router.get('/', siteController.index);

module.exports = router;