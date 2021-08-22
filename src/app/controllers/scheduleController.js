const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');

class ScheduleController {
    index(req, res, next) {
        Schedule.find({}).sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    let dayStart = new Date(schedule.dayStart);
                    let dayEnd = new Date(schedule.dayEnd);

                    schedule.dayStart = `${dayStart.getDate()}/${dayStart.getMonth()}/${dayStart.getFullYear()}`;
                    schedule.dayEnd = `${dayEnd.getDate()}/${dayEnd.getMonth()}/${dayEnd.getFullYear()}`;
                    return schedule;
                });
                res.render('schedules/stored', { schedules });
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
            dayOfWeek.forEach((day, currentIndex) => {
                let temp = {...rawSchedule };

                temp.dayOfWeek = day;
                temp.partOfDay = rawSchedule.partOfDay[currentIndex];
                temp.dayStart = Date.parse(rawSchedule.dayStart);
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
                res.redirect('/schedules/stored');
            })
            .catch(next);
    }
    manager(req, res, next) {
        Schedule.find({}).sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    let dayStart = new Date(schedule.dayStart);
                    let dayEnd = new Date(schedule.dayEnd);

                    schedule.dayStart = `${dayStart.getDate()}/${dayStart.getMonth()}/${dayStart.getFullYear()}`;
                    schedule.dayEnd = `${dayEnd.getDate()}/${dayEnd.getMonth()}/${dayEnd.getFullYear()}`;
                    return schedule;
                });
                res.render('schedules/manager', { schedules });
            })
            .catch(next);
    }
    modify(req, res, next) {
        let id = req.params.id;
        Schedule.findOne({ '_id': id })
            .then(schedule => {

                res.render('schedules/modify', mongooseToObject(schedule));
            })
            .catch(next);
    }
    delete(req, res, next) {
        let id = req.params.id;
        Schedule.delete({ '_id': id })
            .then(() => {
                res.redirect('/schedules/stored');
            })
            .catch(next);
    }
    update(req, res, next) {
        let id = req.params.id;
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;

        if (Array.isArray(dayOfWeek)) {
            dayOfWeek = [...dayOfWeek];
            let schedules = [];
            let scheduleNeedUpdate;

            dayOfWeek.forEach((day, currentIndex) => {
                let temp = {...rawSchedule };

                temp.dayOfWeek = day;
                temp.partOfDay = rawSchedule.partOfDay[currentIndex];
                temp.dayStart = Date.parse(temp.dayStart);
                temp.dayEnd = Date.parse(temp.dayEnd);
                if (currentIndex == 0) {
                    scheduleNeedUpdate = {...temp };
                } else {
                    schedules.push(temp);
                }
            });
            let updateASchedule = Schedule.updateOne({ '_id': id }, scheduleNeedUpdate);
            let createSchedules = Schedule.insertMany(schedules);

            Promise.all(updateASchedule, createSchedules)
                .then(() => {
                    res.redirect('/schedules/stored');
                })
                .catch(next);
        } else {
            rawSchedule.dayStart = Date.parse(rawSchedule.dayStart);
            rawSchedule.dayEnd = Date.parse(rawSchedule.dayEnd);

            Schedule.updateOne({ '_id': id }, rawSchedule)
                .then(() => {
                    res.redirect('/schedules/stored');
                })
                .catch(next);
        }
    }
    handleMultiAction(req, res, next) {
        let method = req.body.method;
        let scheduleIds = req.body.id;

        switch (method) {
            case 'delete':
                {
                    Schedule.delete({ '_id': scheduleIds })
                    .then(
                        function(done) {
                            res.redirect('/schedules/stored');
                        }
                    )
                    .catch(next);
                    break;
                }
        }
    }
}

module.exports = new ScheduleController