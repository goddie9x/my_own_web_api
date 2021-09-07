const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/postController');

router.get('/', PostController.index);

module.exports = router;