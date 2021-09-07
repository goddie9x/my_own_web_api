const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const jwt = require('jsonwebtoken');

class UserController {
    index(req, res, next) {
        res.render('users/profile');
    }
    register(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;
        User.find({
                account: account
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    User.create({ account, password })
                        .then((user) => {
                            let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '1h' });
                            res.send({ token });
                        })
                        .catch(next);
                } else {
                    res.status(404).redirect('/404');
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
                    res.status(404).redirect('/404');
                }

                User.updateOne({ _id: user[0]._id }, { status: true });
                jwt.sign({ _id: user[0]._id }, process.env.JWT, { expiresIn: '1h' },
                    function(err, token) {
                        res.send({ token });
                    });
            })
            .catch(next);
    }
    profile(req, res, next) {
        let accountID = req.params.id;

        User.findById(accountID)
            .then(user => {
                let { password, ...userInfo } = user;

                if (req.cookies.tokenUID) {
                    let temp = req.cookies.tokenUID;
                    let userId;
                    try {
                        userId = jwt.verify(temp, process.env.JWT);
                    } catch (err) {
                        res.status(500).json({ message: 'Phiên đăng nhập hết hạn, bạn cần đăng nhập lại' });
                    }
                    if (userId == user._id) {
                        res.render('users/profile', { userInfo });
                    }
                }
                res.render('users/profile', userInfo);
            })
            .catch(function(err) {
                res.status(404).redirect('/404');
                next();
            });
    }
    userInfo(req, res, next) {
        let user = req.data;
        res.send(user);
    }
    bannedUser(req, res, next) {
        User.findDeleted({})
            .then((users) => {
                users = multipleMongooseToObjects(users);
                res.send(users);
            })
            .catch((err) => {
                res.status(500).redirect('/500');
            })
    }
    manager(req, res, next) {
        User.find({})
            .then((users) => {
                users = multipleMongooseToObjects(users);
                res.send(users);
            })
            .catch((err) => {
                res.status(500).redirect('/500');
            })
    }
}

module.exports = new UserController;