const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function checkUserLogin(req, res, next) {

    try {
        let temp = req.cookies.tokenUser;
        let userId = jwt.verify(temp, process.env.JWT);
        User.findById(userId)
            .then((user) => {
                if (user) {
                    //we do not really need password and it can be stolen
                    let { password, ...data } = user._doc;
                    data = {...data };
                    req.data = data;
                    res.locals._user = data;
                    next();
                }
            });
    } catch (err) {
        next();
    }
}