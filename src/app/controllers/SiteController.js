const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const { convertDateToDMY } = require('../../utils/convertDate');
const checkAndAddHttpSlash = require('../../utils/checkAndAddHttpSlash');

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
}
module.exports = new SiteController;