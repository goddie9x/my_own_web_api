const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/scheduleController');
const checkModLogin = require('../app/middlewares/checkModLogin');

router.get('/create', scheduleController.create);
router.delete('/trash/:id', checkModLogin, scheduleController.forceDeleteAnItem);
router.get('/trash', scheduleController.trash);
router.post('/handleMultiAction', checkModLogin, scheduleController.handleMultiAction);
router.get('/modify/:id', checkModLogin, scheduleController.modify);
router.get('/restore/:id', checkModLogin, scheduleController.restore);
router.delete('/stored/:id', checkModLogin, scheduleController.delete);
router.patch('/stored/:id', checkModLogin, scheduleController.update);
router.post('/stored', checkModLogin, scheduleController.stored);
router.get('/stored', checkModLogin, scheduleController.manager);
router.get('/', scheduleController.index);

module.exports = router;