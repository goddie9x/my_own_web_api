const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

router.post('/avatar', checkUserLogin, multipartyMiddleware, PostController.storeAvatar);
router.get('/create', checkUserLogin, PostController.create);
router.post('/create', checkUserLogin, PostController.store);
router.get('/:slug', PostController.viewPost);
router.get('/', PostController.index);

module.exports = router;