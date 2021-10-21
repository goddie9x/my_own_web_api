const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function checkUserLogin(req, res, next) {
    let currentUserRole = req.data.currentUser.role;
    console.log(currentUserRole);

    if (currentUserRole < 4) {
        next();
    } else {
        res.status(500).redirect('/loginSessionExpired');
    }
}