const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/scheduleController');

router.get('/create', scheduleController.create);
router.delete('/trash/:id', scheduleController.forceDeleteAnItem);
router.get('/trash', scheduleController.trash);
router.post('/handleMultiAction', scheduleController.handleMultiAction);
router.get('/modify/:id', scheduleController.modify);
router.get('/restore/:id', scheduleController.restore);
router.delete('/stored/:id', scheduleController.delete);
router.patch('/stored/:id', scheduleController.update);
router.post('/stored', scheduleController.stored);
router.get('/stored', scheduleController.manager);
router.get('/', scheduleController.index);

module.exports = router;