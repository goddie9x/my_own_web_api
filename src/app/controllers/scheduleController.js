const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');
const checkAndAddHttpSlash = require('../../utils/checkAndAddHttpSlash');
const { convertDateToDMY, reverseDateForDisplayInForm } = require('../../utils/convertDate');
const SCHEDULE_PER_PAGE = 8;
const path = require('path');
class ScheduleController {
    index(req, res, next) {
            let page = req.query.page;

            if (page) {
                if (page < 1) {
                    page = 1;
                }
                let numberOfSchedulesPass = (page - 1) * SCHEDULE_PER_PAGE;

                Schedule.find({}).sort({ dayOfWeek: "asc", partOfDay: "asc" })
                    .skip(numberOfSchedulesPass)
                    .limit(SCHEDULE_PER_PAGE)
                    .then(schedules => {
                        schedules = multipleMongooseToObjects(schedules);

                        schedules = schedules.map(function(schedule) {
                            schedule.dayStart = convertDateToDMY(schedule.dayStart);
                            schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                            return schedule;
                        });
                        res.render('schedules/stored', { schedules });
                    })
                    .catch(next);
            } else {
                Schedule.find({}).sort({ dayOfWeek: "asc", partOfDay: "asc" })
                    .then(schedules => {
                        schedules = multipleMongooseToObjects(schedules);

                        schedules = schedules.map(function(schedule) {
                            schedule.dayStart = convertDateToDMY(schedule.dayStart);
                            schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                            return schedule;
                        });
                        res.render('schedules/stored', { schedules });
                    })
                    .catch(next);
            }
        }
        //create a schedule
    create(req, res, next) {
        res.render('schedules/create');
    }
    stored(req, res, next) {
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;
        let schedules = [];
        //if schedule got more  dayOfWeek than spreed to multiple schedules
        if (Array.isArray(dayOfWeek)) {
            dayOfWeek.forEach((day, currentIndex) => {
                let temp = {...rawSchedule };

                temp.dayOfWeek = day;
                temp.partOfDay = rawSchedule.partOfDay[currentIndex];
                temp.dayStart = Date.parse(rawSchedule.dayStart);
                temp.dayEnd = Date.parse(temp.dayEnd);
                temp.linkMeet = temp.linkMeet.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                schedules.push(temp);
            });
        } else {
            rawSchedule.dayStart = Date.parse(rawSchedule.dayStart);
            rawSchedule.dayEnd = Date.parse(rawSchedule.dayEnd);
            rawSchedule.linkMeet = rawSchedule.linkMeet.map(function(link) {
                return checkAndAddHttpSlash(link);
            });
            schedules.push(rawSchedule);
        }

        Schedule.insertMany(schedules)
            .then(() => {
                res.redirect('/schedules/stored');
            })
            .catch(next);
    }
    manager(req, res, next) {
        let page = req.query.page;
        if (page) {
            if (page < 1) {
                page = 1;
            }
            let numberOfSchedulesPass = (page - 1) * SCHEDULE_PER_PAGE;
            let counterSchedule = Schedule.countDocuments();
            let finderSchedule = Schedule.find({}).sort({ dayOfWeek: "asc", partOfDay: "asc" })
                .skip(numberOfSchedulesPass)
                .limit(SCHEDULE_PER_PAGE);

            Promise.all([finderSchedule, counterSchedule])
                .then(([schedules, notDelete]) => {
                    schedules = multipleMongooseToObjects(schedules).map(function(schedule) {
                        schedule.dayStart = convertDateToDMY(schedule.dayStart);
                        schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                        return schedule;
                    });

                    res.send({ schedules, notDelete });
                })
                .catch(next);
        } else {
            Schedule.countDeleted()
                .then(deleted => {
                    res.render('schedules/manager', { deleted });
                })
                .catch(next);
        }
    }
    modify(req, res, next) {
        let id = req.params.id;
        Schedule.findOne({ '_id': id })
            .then(schedule => {
                schedule = mongooseToObject(schedule);

                schedule.dayStart = reverseDateForDisplayInForm(schedule.dayStart);
                schedule.dayEnd = reverseDateForDisplayInForm(schedule.dayEnd);
                res.render('schedules/modify', schedule);
            })
            .catch(next);
    }
    delete(req, res, next) {
        let id = req.params.id;
        Schedule.delete({ '_id': id })
            .then((done) => {
                res.json('done');
            })
            .catch(next);
    }
    update(req, res, next) {
        let id = req.params.id;
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;
        //if schedule got more  dayOfWeek than spreed to multiple schedules
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
            case 'restore':
                {
                    Schedule.restore({ '_id': scheduleIds })
                    .then(
                        function(done) {
                            res.redirect('/schedules/trash');
                        }
                    )
                    .catch(next);
                    break;
                }
            case 'forceDelete':
                {
                    Schedule.findDeleted({ '_id': scheduleIds }).remove()
                    .then(
                        function(done) {
                            res.redirect('/schedules/trash');
                        }
                    )
                    .catch(next);
                    break;
                }
        }
    }
    restore(req, res, next) {
        let id = req.params.id;
        Schedule.restore({ '_id': id })
            .then(() => {
                res.redirect('/schedules/trash');
            })
            .catch(next);
    }
    trash(req, res, next) {
        let page = req.query.page;
        if (page) {
            if (page < 1) {
                page = 1;
            }
            let numberOfSchedulesPass = (page - 1) * SCHEDULE_PER_PAGE;
            let schedulesDeletedFind = Schedule.findDeleted({})
                .sort({ dayOfWeek: "asc", partOfDay: "asc" })
                .skip(numberOfSchedulesPass)
                .limit(SCHEDULE_PER_PAGE);
            let countScheduleNotDelete = Schedule.countDocuments();

            Promise.all([schedulesDeletedFind, countScheduleNotDelete])
                .then(function([schedulesDeleted, countNotDelete]) {
                    schedulesDeleted = multipleMongooseToObjects(schedulesDeleted);

                    schedulesDeleted = schedulesDeleted.map(function(schedule) {
                        schedule.dayStart = convertDateToDMY(schedule.dayStart);
                        schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                        return schedule;
                    });
                    res.render('schedules/trash', { schedulesDeleted, countNotDelete });
                })
                .catch(next);
        } else {

            let schedulesDeletedFind = Schedule.findDeleted({}).sort({ dayOfWeek: "asc", partOfDay: "asc" });
            let countScheduleNotDelete = Schedule.countDocuments();

            Promise.all([schedulesDeletedFind, countScheduleNotDelete])
                .then(function([schedulesDeleted, countNotDelete]) {
                    schedulesDeleted = multipleMongooseToObjects(schedulesDeleted);

                    schedulesDeleted = schedulesDeleted.map(function(schedule) {
                        schedule.dayStart = convertDateToDMY(schedule.dayStart);
                        schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                        return schedule;
                    });
                    res.render('schedules/trash', { schedulesDeleted, countNotDelete });
                })
                .catch(next);
        }
    }
    forceDeleteAnItem(req, res, next) {
        let id = req.params.id;

        Schedule.findDeleted({ '_id': id }).remove()
            .then(
                function(done) {
                    res.redirect('/schedules/trash');
                }
            )
            .catch(next);
    }
}

module.exports = new ScheduleController