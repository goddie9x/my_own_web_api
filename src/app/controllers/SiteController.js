const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const { convertDateToDMY } = require('../../utils/convertDate');

class siteController {

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
}
module.exports = new siteController;