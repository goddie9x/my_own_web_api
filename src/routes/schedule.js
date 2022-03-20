const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/scheduleController');
const checkModLogin = require('../app/middlewares/checkModLogin');

router.delete('/trash/:id', checkModLogin, scheduleController.forceDeleteAnItem);
router.get('/template', scheduleController.template);
router.post('/trash', checkModLogin, scheduleController.trash);
router.post('/handleMultiAction', checkModLogin, scheduleController.handleMultiAction);
router.get('/modify/:id', checkModLogin, scheduleController.modify);
router.post('/restore/:id', checkModLogin, scheduleController.restore);
router.delete('/stored/:id', checkModLogin, scheduleController.delete);
router.patch('/stored/:id', checkModLogin, scheduleController.update);
router.get('/stored/:id', scheduleController.view);
router.post('/create', scheduleController.create);
router.post('/stored', checkModLogin, scheduleController.manager);
router.post('/', scheduleController.index);

module.exports = router;