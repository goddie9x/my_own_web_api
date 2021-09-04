const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const viewUser = require('../app/middlewares/viewUser');

router.get('/profile/:id', viewUser, userController.profile);
router.post('/loggin', userController.loggin);
router.post('/register', userController.register);
router.get('/', userController.index);

module.exports = router;