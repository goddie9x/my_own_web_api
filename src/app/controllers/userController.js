const User = require('../models/User');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const ITEM_PER_PAGE = 8;
const SALT_ROUNDS = 10;
const PRE_CLASSMATE_STRING = 'UHC';
class UserController {
    index(req, res, next) {
        res.render('users/profile');
    }
    register(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;
        let isClassmate = account.slice(0, 3) == PRE_CLASSMATE_STRING;
        console.log(account.slice(0, 3));
        User.find({
                account: account
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
                    const passwordEncrypted = bcrypt.hashSync(password, salt);
                    if (isClassmate) {
                        User.create({ account, password: passwordEncrypted, role: 2 })
                            .then((user) => {
                                let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '48h' });
                                res.send({ token });
                            })
                            .catch(next);
                    } else {
                        User.create({ account, password: passwordEncrypted })
                            .then((user) => {
                                let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '48h' });
                                res.send({ token });
                            })
                            .catch(next);
                    }
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
                account
            })
            .then(user => {
                if (user._id) {
                    let isCorrectPassword = bcrypt.compareSync(password, user.password);

                    if (isCorrectPassword) {
                        User.findOneAndUpdate({ _id: user._id }, { status: true });
                        jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '48h' },
                            function(error, token) {
                                res.send({ token });
                            });
                    } else {
                        res.status(500).json({ message: 'error' });
                    }
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

        User.findOne({ _id: accountID })
            .then(user => {
                let userInfo = mongooseToObject(user);

                if (req.cookies.tokenUser) {
                    let temp = req.cookies.tokenUser;
                    let currentUse;

                    try {
                        currentUse = jwt.verify(temp, process.env.JWT);
                    } catch (err) {
                        res.status(500).redirect('/loginSessionExpired');
                    }

                    if (currentUse._id == accountID) {
                        res.render('users/profile', { userInfo });
                    }
                } else {

                    //we do not want other user can get password of this
                    delete userInfo.password;
                    res.render('users/profile', { userInfo });
                }
            })
            .catch(function(err) {
                res.status(404).redirect('/404');
            });
    }
    userUpdateInfo(req, res, next) {
        let currentUserId = req.data.currentUser._id;
        let userID = req.params.id;

        if (currentUserId == userID) {}
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