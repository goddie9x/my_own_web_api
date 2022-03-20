const express = require('express');
const router = express.Router();
const notifController = require('../app/controllers/notifController');

router.post('/read', notifController.read);
router.post('/view', notifController.view);
router.post('/', notifController.index);

module.exports = router;