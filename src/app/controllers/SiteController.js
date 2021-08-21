const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
class SiteController {

    index(req, res, next) {
        Schedule.find({})
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    let dayStart = new Date(schedule.dayStart);
                    let dayEnd = new Date(schedule.dayEnd);

                    schedule.dayStart = `${dayStart.getMonth()}/${dayStart.getDate()}/${dayStart.getFullYear()}`;
                    schedule.dayEnd = `${dayEnd.getMonth()}/${dayEnd.getDate()}/${dayEnd.getFullYear()}`;
                    return schedule;
                });
                res.render('home', { schedules });
            })
            .catch(next);
    }
    search(req, res) {
        res.render('search');
    }
}
module.exports = new SiteController();