const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const { convertDateToDMY } = require('../../utils/convertDate');
const checkAndAddHttpSlash = require('../../utils/checkAndAddHttpSlash');
const { resourcesCloudinary } = require('../../config/cloudinary/cloudinary.config');
const { destroySingleCloudinary } = require('../../config/cloudinary/cloudinary.config');
const transporter = require('../../utils/sendAmail');
class SiteController {

    index(req, res, next) {
        let userRole = req.data && req.data.currentUser && req.data.currentUser.role;
        if (req.query.page) {
            let today = new Date();

            today = Date.parse(today);
            Schedule.find({
                    dayStart: { $lt: today },
                    dayEnd: { $gt: today }
                }).sort({ dayOfWeek: "asc", partOfDay: "asc" })
                .then(schedules => {
                    schedules = multipleMongooseToObjects(schedules);
                    schedules.forEach(schedule => {
                        if (userRole && userRole < 3) {
                            schedule.linkMeet = schedule.linkMeet.map(function(link) {
                                return checkAndAddHttpSlash(link);
                            });
                        } else {
                            schedule.linkMeet = schedule.linkMeet.map(function(link) {
                                return '/notPermission';
                            });
                        }
                    })
                    const mailOptions = {
                        from: process.env.MAIL_ACCOUNT,
                        to: 'boykeodang@gmail.com',
                        subject: 'My first Email!!!',
                        text: "This is my first email. I am so excited!"
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    schedules = schedules.map(function(schedule) {
                        schedule.dayStart = convertDateToDMY(schedule.dayStart);
                        schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                        return schedule;
                    });
                    res.send({ schedules });
                })
                .catch(next);
        } else {
            res.render('home');
        }
    }
    game(req, res, next) {
        res.render('sites/game');
    }
    search(req, res, next) {
        Schedule.find({
                name: { $regex: '.*' + req.query.name + '.*' }
            })
            .then(schedules => {

                schedules = schedules.map(function(schedule) {
                    schedule.dayStart = convertDateToDMY(schedule.dayStart);
                    schedule.dayEnd = convertDateToDMY(schedule.dayEnd);

                    return schedule;
                });

                res.render('sites/search', { schedules });
            })
            .catch(next);
    }
    roomChat(req, res, next) {
        res.render('sites/roomChat');
    }
    notFound(req, res, next) {
        res.render('sites/notFound');
    }
    errorServer(req, res, next) {
        res.render('sites/severError');
    }
    notPermission(req, res, next) {
        res.render('sites/notPermission');
    }
    loginAccess(req, res, next) {
        res.render('sites/loginAccess');
    }
    loginSessionExpired(req, res, next) {
        res.render('sites/loginSessionExpired');
    }
    images(req, res, next) {
        resourcesCloudinary(function(error, result) {
            if (result) {
                let images = Object.keys(result.resources).map(
                    (key) =>
                    ({
                        url: result.resources[key].url,
                        id: result.resources[key].public_id
                    })
                );
                res.render('posts/viewImages', { images });
            } else {
                res.redirect('/404');
            }
        });
    }
    cloudinaryDelete(req, res, next) {
        let image = req.params.image;
        console.log(req.params);

        destroySingleCloudinary(image, function(error, result) {
            res.send(result);
        });
    }
    cloudinary(req, res, next) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        let url = req.file.path;
        let msg = 'Upload successfully';
        let funcNum = req.query.CKEditorFuncNum;

        res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" +
            funcNum + "','" + url + "','" + msg + "');</script>");
    }
}
module.exports = new SiteController;