const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkClassMemberLogin = require('../app/middlewares/checkClassMemberLogin');
const checkUserLogin = require('../app/middlewares/checkUserLogin');

router.post('/create', checkUserLogin, PostController.store);
router.post('/modify/:slug', checkUserLogin, PostController.store);
router.post('/by-user/:slug', checkClassMemberLogin, PostController.store);
router.post('/by-tag/:slug', PostController.store);
router.post('/view/:slug', PostController.viewPost);
router.delete('/:slug', checkUserLogin, PostController.delete);
router.post('/', PostController.index);

module.exports = router;