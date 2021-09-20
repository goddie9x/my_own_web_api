const express = require('express');
const router = express.Router();
const newsController = require('../app/controllers/newsController');

router.get('/create', newsController.create);
router.get('/', newsController.index);
module.exports = router;