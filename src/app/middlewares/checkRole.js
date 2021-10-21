const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function checkRole(req, res, next) {
    try {
        let temp = req.cookies.tokenUser;
        let userId = jwt.verify(temp, process.env.JWT);
        User.findById(userId)
            .then((user) => {
                if (user) {
                    let { password, ...data } = user._doc;
                    if (req.data) {
                        req.data = {...req.data, currentUser: data }
                    } else {
                        req.data = { currentUser: data };
                    }
                    res.locals._user = data;
                    next();
                } else {
                    next();
                }
            })
            .catch(err => {
                next();
            });
    } catch {
        next();
    }
}