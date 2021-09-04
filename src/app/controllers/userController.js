const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const jwt = require('jsonwebtoken');

class userController {
    index(req, res, next) {
        res.render('users/profile');
    }
    register(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        console.log(account, password);
        User.find({
                account: account
            })
            .then(user => {
                if (Object.keys(user).length === 0) {
                    User.create({ account, password })
                        .then((user) => {
                            User.updateOne({ _id: user._id }, { status: true });
                            let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '1h' });
                            res.send({ token });
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

                User.updateOne({ _id: user._id }, { status: true });
                let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '1h' });
                res.send({ token });
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