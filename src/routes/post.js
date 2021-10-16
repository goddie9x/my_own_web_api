const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkClassMemberLogin = require('../app/middlewares/checkClassMemberLogin');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const { uploadCloud } = require('../config/cloudinary/cloudinary.config');

router.get('/create', checkClassMemberLogin, PostController.create);
router.post('/create', checkClassMemberLogin, uploadCloud.single('avatarUrl'), PostController.store);
router.get('/all', checkUserLogin, PostController.viewAllPosts);
router.get('/news', PostController.news);
router.get('/notifs', PostController.notifs);
router.delete('/:image', checkClassMemberLogin, PostController.delete);
router.get('/:slug', PostController.viewPost);
router.get('/', PostController.index);

module.exports = router;