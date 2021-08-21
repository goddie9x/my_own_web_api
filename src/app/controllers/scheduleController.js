const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');

class ScheduleController {
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

                res.render('schedules/stored', schedules);
            })
            .catch(next);
    }
    create(req, res, next) {
        res.render('schedules/create');
    }
    stored(req, res, next) {
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;
        let schedules = [];

        if (Array.isArray(dayOfWeek)) {
            let temp = {...rawSchedule };
            dayOfWeek.forEach((day) => {
                temp.dayOfWeek = day;
                temp.dayStart = Date.parse(temp.dayStart);
                temp.dayEnd = Date.parse(temp.dayEnd);
                schedules.push(temp);
            });
        } else {
            rawSchedule.dayStart = Date.parse(rawSchedule.dayStart);
            rawSchedule.dayEnd = Date.parse(rawSchedule.dayEnd);

            schedules.push(rawSchedule);
        }

        Schedule.insertMany(schedules)
            .then(() => {
                res.redirect('schedules/stored');
            })
            .catch(next);
    }
}

module.exports = new ScheduleController