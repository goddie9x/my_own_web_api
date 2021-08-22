const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/scheduleController');

router.get('/create', scheduleController.create);
router.get('/modify/:id', scheduleController.modify);
router.delete('/stored/:id', scheduleController.delete);
router.patch('/stored/:id', scheduleController.update);
router.post('/stored', scheduleController.stored);
router.get('/stored', scheduleController.manager);
router.get('/', scheduleController.index);

module.exports = router;