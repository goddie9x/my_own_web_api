const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/game', siteController.game);
router.get('/room-chat', siteController.roomChat);
router.get('/', siteController.index);

module.exports = router;