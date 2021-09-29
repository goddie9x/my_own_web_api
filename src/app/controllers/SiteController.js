const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const { convertDateToDMY } = require('../../utils/convertDate');
const checkAndAddHttpSlash = require('../../utils/checkAndAddHttpSlash');
const path = require('path');
const fs = require('fs');
class SiteController {

    index(req, res, next) {
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
                        schedule.linkMeet = schedule.linkMeet.map(function(link) {
                            return checkAndAddHttpSlash(link);
                        });
                    })

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
    upImage(req, res, next) {
        try {
            fs.readFile(req.files.upload.path, function(err, data) {
                var newPath = path.join(__dirname, '../../public/images/' + req.files.upload.name);
                fs.writeFile(newPath, data, function(err) {
                    if (err) console.log({ err: err });
                    else {
                        //     imgl = '/images/req.files.upload.originalFilename';
                        //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
                        //    res.status(201).send(img);

                        let fileName = req.files.upload.name;
                        let url = '/images/' + fileName;
                        let msg = 'Upload successfully';
                        let funcNum = req.query.CKEditorFuncNum;

                        res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
                    }
                });
            });
        } catch (error) {
            console.log(error.message);
        }
    }
    images(req, res, next) {
        const images = fs.readdirSync(path.join(__dirname, '../../public/images'));

        res.render('posts/viewImages', { images });
    }
    cloudinary(req, res, next) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        res.json({ secure_url: req.file.path });
    }
}
module.exports = new SiteController;