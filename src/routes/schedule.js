const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/scheduleController');

router.get('/create', scheduleController.create);
router.post('/stored', scheduleController.stored);
router.get('/', scheduleController.index);

module.exports = router;