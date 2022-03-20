const User = require('../models/User');
const Image = require('../models/Image');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const ITEM_PER_PAGE = 8;
const SALT_ROUNDS = 10;
const PRE_CLASSMATE_STRING = 'UHC';
const startSendMail = require('../../utils/sendAmail');
class UserController {
    index(req, res) {
        res.json(req.data);
    }
    register(req, res) {
        const account = req.body.account;
        const password = req.body.password;
        let email = req.body.email;
        const isClassmate = account.slice(0, 3) == PRE_CLASSMATE_STRING;
        const checkAccountExit = User.find({
            account: account
        });
        const checkEmailExit = User.find({
            email: { $in: email }
        });
        Promise.all([checkAccountExit, checkEmailExit])
            .then(([accountExit, emailExit]) => {
                if (Object.keys(accountExit).length !== 0) {
                    res.status(401).json({ message: 'account existed' });
                    return;
                }
                if (Object.keys(emailExit).length !== 0) {
                    res.status(402).json({ message: 'email existed' });
                    return;
                }
                try {
                    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
                    const passwordEncrypted = bcrypt.hashSync(password, salt);
                    if (isClassmate) {
                        User.create({ account, password: passwordEncrypted, email: [email], role: 2 })
                            .then((user) => {
                                let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '720h' });
                                res.send({ token });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).send('Create account failed');
                            });
                    } else {
                        User.create({ account, password: passwordEncrypted, email: [email] })
                            .then((user) => {
                                let token = jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '720h' });
                                res.send({ token });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).send('Create account failed');
                            });
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).send('Create account failed');
                }

            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Create account failed');
            });
    }
    login(req, res) {
        const { account, password } = req.body;
        User.findOne({
                account
            })
            .then(user => {
                if (user._id) {
                    let isCorrectPassword = bcrypt.compareSync(password, user.password);
                    if (isCorrectPassword) {
                        User.updateOne({ _id: user._id }, { $set: { status: true } });
                        jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: '720h' },
                            function(error, token) {
                                res.send({ token });
                            });
                    } else {
                        console.log('password is not correct');
                        res.status(500).json({ message: 'error' });
                        return;
                    }
                } else {
                    console.log('account is not correct');
                    res.status(500).json({ message: 'error' });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    }
    profile(req, res) {
        let accountID = req.params.id;
        if (accountID.match(/^[0-9a-fA-F]{24}$/)) {
            User.findOne({ _id: accountID })
                .then(user => {
                    let userInfo = mongooseToObject(user);
                    delete userInfo.password;
                    delete userInfo.createdAt;
                    delete userInfo.updatedAt;
                    res.json(userInfo);
                    return;
                })
                .catch(function(err) {
                    res.status(404).json('404');
                    return;
                });
        } else {
            console.log('accountID is not correct');
            res.status(500).json({ message: 'error' });
        }
    }
    updateInfo(req, res) {
        let currentUserId = req.data.currentUser._id;
        let userID = req.params.id;
        if (userID.match(/^[0-9a-fA-F]{24}$/)) {
            if (currentUserId == userID) {
                let { currentUser, role, ...userInfo } = req.body;
                if (userInfo.image) {
                    User.updateOne({ _id: userID }, { $set: { image: userInfo.image } })
                        .then(() => {
                            res.status(200).json({ message: 'Update success' });
                            return;
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                            return;
                        });
                } else {
                    User.findOne({
                            email: {
                                $in: userInfo.email,
                            }
                        })
                        .then((data) => {
                            if (data && data.length > 0) {
                                res.status(500).json({ message: 'Email existed' });
                                return;
                            } else {
                                User.updateOne({ _id: userID }, { $set: userInfo })
                                    .then(() => {
                                        res.status(200).json({ message: 'Update success' });
                                        return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.status(500).json({ message: 'Update failed' });
                                        return;
                                    });
                            }
                        })
                }
            } else {
                res.status(401).json('not permition');
                return;
            }
        } else {
            console.log('accountID is not correct');
            res.status(500).json({ message: 'error' });
        }
    }
    updateAvartar(req, res) {
        let currentUserId = req.data.currentUser._id;
        let userID = req.params.id;
        const imageUrl = (req.file) ? (req.file.path) : (process.env.MAIN_CLIENT_SITE + '/images/default.png');
        const uploadImage = Image.create({
            url: imageUrl,
            public_id: req.file ? req.file.public_id : '',
        });

        if (currentUserId == userID) {
            const updateAvartar = User.updateOne({ _id: userID }, { $set: { image: imageUrl } })
            Promise.all([uploadImage, updateAvartar])
                .then((data) => {
                    res.status(200).json({ message: 'Update success' });
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: 'Update failed' });
                    return;
                });
        } else {
            console.log('not permition');
            res.status(401).json('not permition');
        }
    }

    bannedUsers(req, res) {
        User.findDeleted({})
            .then((users) => {
                users = multipleMongooseToObjects(users);
                res.send(users);
            })
            .catch((err) => {
                res.status(500).json('500');
            })
    }
    manager(req, res) {
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
                    res.status(500).json('500');
                })
        }
        User.countDeleted({})
            .then(countUserBanned => {
                res.json(countUserBanned);
            })
    }
    restore(req, res) {
        const emailCheck = req.body.email;
        console.log(emailCheck);
        User.find({ email: { $elemMatch: { $eq: emailCheck } } })
            .then(user => {
                if (user.length > 0) {
                    const tokenRestore = jwt.sign({ _id: user[0]._id }, process.env.JWT, { expiresIn: '10m' });
                    startSendMail({
                        to: emailCheck,
                        subject: 'Khôi phục tài khoản',
                        html: `<div style="text-align: center;color:#fff;background-color:#0a1929;padding:16px;border-radius:10px;"><h2>Bạn đã yêu cầu khôi phục tài khoản tại trang TE11</h2>
                            <p>Bấm vào <a href="${process.env.MAIN_CLIENT_SITE + '/user/reset-password/' + tokenRestore}">link này</a> để khôi phục mật khẩu</p>
                            <p>Lưu ý: Link chỉ có hiệu lực trong vòng 10p</p><div>`,
                    }, (err, info) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json('500');
                            return;
                        } else {
                            res.json('success');
                            return;
                        }
                    });
                } else {
                    res.status(404).json('email not found');
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(404).send('Account not found');
            })
    }
    resetPassword(req, res) {
        const tokenRestore = req.params.tokenRestore;
        const newPassword = req.body.password;
        try {
            const salt = bcrypt.genSaltSync(SALT_ROUNDS);
            const passwordEncrypted = bcrypt.hashSync(newPassword, salt);
            const userId = jwt.verify(tokenRestore, process.env.JWT);
            const updatePasswordStatus = User.updateOne({ _id: userId }, { $set: { password: passwordEncrypted } });
            const userInfo = User.findOne({ _id: userId });

            Promise.all([updatePasswordStatus, userInfo])
                .then(([updatePasswordStatus, userInfo]) => {
                    if (updatePasswordStatus.modifiedCount > 0) {
                        res.json({ account: userInfo.account });
                        return;
                    } else {
                        res.status(404).json('404');
                        return;
                    }
                });
        } catch (err) {
            console.log(err);
            res.status(500).send('token expired or invalid');
        }
    }
}

module.exports = new UserController;