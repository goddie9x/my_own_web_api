const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function checkUserLogin(req, res, next) {

    let temp = req.cookies.tokenUID;
    let userId;

    if (temp) {
        try {
            userId = jwt.verify(temp, process.env.JWT);
        } catch (err) {
            res.status(500).json({ message: 'Phiên đăng nhập hết hạn, bạn cần đăng nhập lại' });
        }
        User.findById(userId._id)
            .then(function(user) {
                if (user) {
                    let { password, ...data } = user._doc;
                    req.data = data;
                    next();
                } else {
                    res.status(404).json({ message: 'Không tìm thấy tài khoản' });
                }
            })
            .catch(function(err) {
                res.status(404).json({ message: 'Không tìm thấy tài khoản' });
            })
    } else {
        res.status(500).json({ message: 'Không có thông tin đăng nhâp' });
    }
}