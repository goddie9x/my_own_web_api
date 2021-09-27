const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const upload = require('../app/middlewares/uploadMiddleware');


router.get('/create', checkUserLogin, PostController.create);
router.post('/create', checkUserLogin, upload.single('image'), PostController.store);
router.get('/', PostController.index);

module.exports = router;