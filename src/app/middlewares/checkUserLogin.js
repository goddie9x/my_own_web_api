const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function userLoginMiddleware(req, res, next) {

    let temp = req.cookies.tokenUID;
    let userID;

    if (temp) {
        try {
            userID = jwt.verify(temp, process.env.JWT);
        } catch (err) {
            res.send(err);
        }
        User.findOne({ _id: userID })
            .then(function(user) {
                let { password, ...data } = user;
                res.locals.user = data;
                next();
            })
            .catch(function(err) {
                res.send(err);
            })
    } else {
        res.send('không có thông tin đăng nhâp');
    }
}