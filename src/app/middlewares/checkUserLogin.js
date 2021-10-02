const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function checkUserLogin(req, res, next) {
    try {
        let temp = req.cookies.tokenUser;
        let userId = jwt.verify(temp, process.env.JWT);
        User.findById(userId)
            .then((user) => {
                if (user) {
                    let { password, ...data } = user._doc;
                    req.data.currentUser = data;
                    next();
                } else {
                    res.status(404).redirect('/loginSessionExpired');
                }
            })
            .catch(err => {
                res.status(500).redirect('/loginSessionExpired');
            });
    } catch {
        res.status(500).redirect('/loginSessionExpired');
    }
}