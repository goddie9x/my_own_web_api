const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const jwt = require('jsonwebtoken');
const ITEM_PER_PAGE = 8;
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
    login(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;
        User.findOne({
                account,
                password
            })
            .then(user => {
                if (user._id) {
                    User.updateOne({ _id: user._id }, { status: true });
                    jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '1h' },
                        function(err, token) {
                            res.send({ token });
                        });
                } else {
                    res.status(500).json({ message: 'error' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err });
            });
    }
    profile(req, res, next) {
        let accountID = req.params.id;
        console.log(res.data);

        User.findById(accountID)
            .then(user => {
                let { password, ...userInfo } = user;

                if (req.cookies.tokenUID) {
                    let temp = req.cookies.tokenUID;
                    let userId;
                    try {
                        userId = jwt.verify(temp, process.env.JWT);
                    } catch (err) {
                        res.status(500).redirect('/loginSessionExpired');
                    }
                    if (userId == user._id) {
                        res.render('users/profile', { userInfo });
                    }
                    res.render('users/profile', userInfo);
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
    bannedUsers(req, res, next) {
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
        let page = req.query.page;
        if (page) {
            if (page < 1) {
                page = 1;
            }
            let pageSkip = (page - 1) * ITEM_PER_PAGE;

            User.find({})
                .skip(pageSkip)
                .limit(ITEM_PER_PAGE)
                .then((users) => {
                    users = multipleMongooseToObjects(users);
                    res.send({ users });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                })
        }
        User.countDeleted({})
            .then(countUserBanned => {
                res.render('users/manager', { countUserBanned });
            })
    }
}

module.exports = new UserController;