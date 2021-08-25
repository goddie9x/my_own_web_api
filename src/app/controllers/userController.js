const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');

class userController {
    index(req, res, next) {
        res.render('users/profile');
    }
    register(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        User.find({
                account
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    User.create({ account, password })
                        .then((user) => {
                            req._user.userID = user._id;
                            req._user.imageUser = user.img;
                            req._user.nameUser = user.name;

                            res.render('users/profile', { user });
                        })
                        .catch(next);
                } else {
                    res.send(`tài khoản ${account} đã tồn tại`);
                }
            })
            .catch(next);
    }
    loggin(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        User.find({
                account,
                password
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    res.send(`tài khoản ${account} không tồn tại`);
                } else {
                    res.send(user);
                    req._user.userID = user._id;
                    req._user.imageUser = user.img;
                    req._user.nameUser = user.name;

                    res.redirect('users');
                }
            })
            .catch(next);
    }
    profile(req, res, next) {
        let accountID = req.params.id;
        User.find({
                _id: accountID
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    res.send(`tài khoản ${account} không tồn tại`);
                } else {
                    req._user.userID = user._id;
                    req._user.imageUser = user.img;
                    req._user.nameUser = user.name;

                    res.render('users/profile', { user });
                }
            })
            .catch(function(err) {
                res.send('cant find this account');
                next();
            });
    }
}

module.exports = new userController;