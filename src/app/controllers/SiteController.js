const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
class siteController {

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
        /*  Schedule.find({
                name: { $regex: '.*' + req.query.name + '.*' }
            })
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    let dayStart = new Date(schedule.dayStart);
                    let dayEnd = new Date(schedule.dayEnd);

                    schedule.dayStart = `${dayStart.getDate()}/${dayStart.getMonth()}/${dayStart.getFullYear()}`;
                    schedule.dayEnd = `${dayEnd.getDate()}/${dayEnd.getMonth()}/${dayEnd.getFullYear()}`;
                    return schedule;
                });
 */
        res.render('sites/search' /* , { schedules } */ );
        /*   })
          .catch(next);*/
    }
}
module.exports = new siteController;