const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');

class userController {
    index(req, res, next) {
        res.send('user logger');
    }
}

module.exports = new userController;