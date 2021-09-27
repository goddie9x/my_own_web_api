const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkUserLogin = require('../app/middlewares/checkUserLogin');

router.get('/create', checkUserLogin, PostController.create);
router.post('/create', checkUserLogin, PostController.store);
router.get('/', PostController.index);

module.exports = router;