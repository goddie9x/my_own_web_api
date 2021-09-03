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
                            req.session.user.userID = user._id;
                            req.session.user.imageUser = user.img;
                            req.session.user.nameUser = user.name;

                            res.render('users/profile');
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
                }
                return User.updateOne({ _id: user._id }, { status: true });
            })
            .then(user => {
                req.session.user = user;
                res.redirect(`/profile/${user._id}`);
            })
            .catch(next);
    }
    profile(req, res, next) {
        let accountID = req.params.id;
        if (req.section.user && accountID == req.section.user._id) {
            req.local._user.userID = req.section.user._id;
            req.local._user.imageUser = req.section.user.img;
            req.local._user.nameUser = req.section.user.name;

            res.render('users/profile');
        } else {

            User.find({
                    _id: accountID
                })
                .then(user => {
                    if (Object.keys(user).length === 0) {
                        res.send(`tài khoản ${account} không tồn tại`);
                    } else {
                        req.local._user.userID = user._id;
                        req.local._user.imageUser = user.img;
                        req.local._user.nameUser = user.name;

                        res.render('users/profile');
                    }
                })
                .catch(function(err) {
                    res.send('cant find this account');
                    next();
                });
        }
    }
}

module.exports = new userController;