const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const { uploadCloud } = require('../config/cloudinary/cloudinary.config');

router.get('/create', checkUserLogin, PostController.create);
router.post('/create', checkUserLogin, uploadCloud.single('avatarUrl'), PostController.store);
router.get('/news', PostController.news);
router.get('/notifs', PostController.notifs);
router.delete('/:image', checkUserLogin, PostController.delete);
router.get('/:slug', PostController.viewPost);
router.get('/', PostController.index);

module.exports = router;