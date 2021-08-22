const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
class SiteController {

    index(req, res, next) {
        let today = new Date();

        today = Date.parse(today);

        Schedule.find({
                dayStart: { $lt: today },
                dayEnd: { $gt: today }
            }).sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    let dayStart = new Date(schedule.dayStart);
                    let dayEnd = new Date(schedule.dayEnd);

                    schedule.dayStart = `${dayStart.getDate()}/${dayStart.getMonth()}/${dayStart.getFullYear()}`;
                    schedule.dayEnd = `${dayEnd.getDate()}/${dayEnd.getMonth()}/${dayEnd.getFullYear()}`;
                    return schedule;
                });

                res.render('home', { schedules });
            })
            .catch(next);
    }
    search(req, res, next) {
        Schedule.find({
                'name': req.query.name
            })
            .then(function(results) {

                res.render('sites/search', results);
            })
            .catch(next);
    }
}
module.exports = new SiteController();