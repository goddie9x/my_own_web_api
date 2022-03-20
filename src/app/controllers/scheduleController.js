const Schedule = require('../models/Schedule');
const Notifs = require('../models/Notification');
const { multipleMongooseToObjects, mongooseToObject } = require('../../utils/mongoose');
const checkAndAddHttpSlash = require('../../utils/checkAndAddHttpSlash');
const { convertDateToDMY, reverseDateForDisplayInForm } = require('../../utils/convertDate');
const SCHEDULE_PER_PAGE = 8;
const path = require('path');
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
class ScheduleController {
    index(req, res, next) {
        let page = req.query.page;
        const type = req.query.type || 0;
        const perPage = +req.query.perPage || SCHEDULE_PER_PAGE;
        let userRole = req.data && req.data.currentUser.role && req.data.currentUser.role;
        if (page) {
            if (page < 1) {
                page = 1;
            }
            const now = new Date().getTime();
            const rules = type ? {
                type: type,
                dayStart: { $lt: now },
            } : {
                type: type,
                dayStart: { $lt: now },
                dayEnd: { $gt: now }
            };
            const numberOfSchedulesPass = (page - 1) * perPage;
            const counterSchedule = Schedule.countDocuments(rules);
            const finderSchedule = Schedule.find(rules).sort({ dayOfWeek: "asc", partOfDay: "asc" })
                .limit(perPage)
                .skip(numberOfSchedulesPass);

            Promise.all([finderSchedule, counterSchedule])
                .then(([schedules, countCurrentStored]) => {
                    schedules = multipleMongooseToObjects(schedules);

                    schedules = schedules.map(function(schedule) {
                        schedule.dayStart = convertDateToDMY(schedule.dayStart);
                        schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                        if (userRole && userRole < 4 || userRole == 0) {
                            schedule.linkMeet = schedule.linkMeet.map(function(link) {
                                return checkAndAddHttpSlash(link);
                            });
                            schedule.linkClass = schedule.linkClass.map(function(link) {
                                return checkAndAddHttpSlash(link);
                            });
                        } else {
                            schedule.linkMeet = schedule.linkMeet.map(function(link) {
                                return '';
                            });
                            schedule.linkClass = schedule.linkClass.map(function(link) {
                                return '';
                            });
                        }
                        return schedule;
                    });
                    res.send({ schedules, countCurrentStored });
                })
                .catch(next);
        } else {
            res.render('schedules/stored');
        }
    }
    template(req, res) {
        const data = qs.stringify({
            'txtusername': process.env.TXTUSERNAME,
            'txtpassword': process.env.TXTPASSWORD,
            'btnDangNhap': 'Đăng nhập',
            '__VIEWSTATE': process.env.__VIEWSTATE,
            '__VIEWSTATEGENERATOR': process.env.__VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': process.env.__EVENTVALIDATION,
        });
        const config = {
            method: 'get',
            url: process.env.URL_GETSCHEDULE,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': '.ASPXAUTH=' + process.env.ASPXAUTH_GETSCHEDULE + '; ASP.NET_SessionId=' + process.env.SESSION_ID_GETSCHEDULE + '; language='
            },
            data: data
        };

        axios(config)
            .then(function(response) {
                const data = response.data;
                const $ = cheerio.load(data);
                const table = $('html').html();
                res.send(table);
            })
            .catch(function(error) {
                console.log(error);
            });

    }
    create(req, res) {
        let userCreatedPost = req.data.currentUser.fullName;
        let authorAvatar = req.data.currentUser.image || '/images/default.png';
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;
        let schedules = [];

        if (Array.isArray(dayOfWeek)) {
            dayOfWeek.forEach((day, currentIndex) => {
                let temp = {...rawSchedule };

                temp.dayOfWeek = day;
                temp.partOfDay = rawSchedule.partOfDay[currentIndex];
                temp.dayStart = Date.parse(rawSchedule.dayStart);
                temp.dayEnd = temp.dayEnd ? Date.parse(temp.dayEnd) : 0;
                temp.linkMeet = temp.linkMeet.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                temp.linkClass = temp.linkClass.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                schedules.push(temp);
            });
        } else {
            rawSchedule.dayStart = Date.parse(rawSchedule.dayStart);
            rawSchedule.dayEnd = rawSchedule.dayEnd ? Date.parse(rawSchedule.dayEnd) : 0;
            rawSchedule.linkMeet = rawSchedule.linkMeet.map(function(link) {
                return checkAndAddHttpSlash(link);
            });
            rawSchedule.linkClass = rawSchedule.linkClass.map(function(link) {
                return checkAndAddHttpSlash(link);
            });
            schedules.push(rawSchedule);
        }
        let createScheduleDone = Schedule.insertMany(schedules);
        let createNotifDone = Notifs.create({
            userNameAthor: userCreatedPost,
            userAthorAvatar: authorAvatar,
            forAll: true,
            //schedule type: {0: schedule, 1: exam} -> notif type: {1: post, 2:news, 3: schedule, 4: exam,  5: comment, 6: like, 7: follow, 8: message}
            type: rawSchedule.type + 3,
            url: '/schedules/' + (rawSchedule.type == 0 ? '' : 'examination'),
        })
        Promise.all([createNotifDone, createScheduleDone])
            .then(() => {
                res.status(200).send('done');
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    }
    manager(req, res) {
        let page = req.query.page;
        const type = req.query.type || 0;
        const perPage = +req.query.perPage || SCHEDULE_PER_PAGE;
        if (page < 1) {
            page = 1;
        }
        const numberOfSchedulesPass = (page - 1) * perPage;
        const counterSchedule = Schedule.countDocuments({ type });
        const finderSchedule = Schedule.find({ type }).sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .limit(perPage)
            .skip(numberOfSchedulesPass);
        const counterDeleted = Schedule.countDocumentsDeleted({ type });

        Promise.all([finderSchedule, counterSchedule, counterDeleted])
            .then(([schedules, countCurrentStored, countOpositeStored]) => {
                schedules = multipleMongooseToObjects(schedules).map(function(schedule) {
                    schedule.dayStart = convertDateToDMY(schedule.dayStart);
                    schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                    schedule.linkMeet = schedule.linkMeet.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                    schedule.linkClass = schedule.linkClass.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                    return schedule;
                });

                res.send({ schedules, countCurrentStored, countOpositeStored });
            })
            .catch(err => {
                console.log(err);
                res.status[500].send('error');
            });
    }
    modify(req, res) {
        let id = req.params.id;

        Schedule.findOne({ '_id': id })
            .then(schedule => {
                schedule = mongooseToObject(schedule);

                schedule.dayStart = reverseDateForDisplayInForm(schedule.dayStart);
                schedule.dayEnd = reverseDateForDisplayInForm(schedule.dayEnd);
                schedule.linkMeet = schedule.linkMeet.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                schedule.linkClass = schedule.linkClass.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                res.json(schedule);
            })
            .catch(next);
    }
    delete(req, res) {
        let id = req.params.id;

        Schedule.delete({ '_id': id })
            .then((done) => {
                res.status(200).send('done');
            })
            .catch((err) => {
                res.status(500).send('error');
            });
    }
    view(req, res) {
        const id = req.params.id;
        const role = req.data ? req.data.currentUser : 4;

        Schedule.findOne({ '_id': id })
            .then(schedule => {
                schedule = mongooseToObject(schedule);

                schedule.dayStart = reverseDateForDisplayInForm(schedule.dayStart);
                schedule.dayEnd = reverseDateForDisplayInForm(schedule.dayEnd);
                if (role < 3) {
                    schedule.linkMeet = schedule.linkMeet.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                    schedule.linkClass = schedule.linkClass.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                } else {
                    schedule.linkMeet = [];
                    schedule.linkClass = [];
                }
                res.json(schedule);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('error');
            });
    }
    update(req, res) {
        let id = req.params.id;
        let rawSchedule = {...req.body };
        let dayOfWeek = rawSchedule.dayOfWeek;
        //if schedule got more  dayOfWeek than spreed to multiple schedules
        if (Array.isArray(dayOfWeek)) {
            dayOfWeek = [...dayOfWeek];
            let schedules = [];
            let scheduleNeedUpdate;
            //because maybe user create many dayOfWeek, then we create multiple schedules for it
            dayOfWeek.forEach((day, currentIndex) => {
                let temp = {...rawSchedule };

                temp.linkMeet = temp.linkMeet.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                temp.linkClass = temp.linkClass.map(function(link) {
                    return checkAndAddHttpSlash(link);
                });
                temp.dayOfWeek = day;
                temp.partOfDay = rawSchedule.partOfDay[currentIndex];
                temp.dayStart = Date.parse(temp.dayStart);
                temp.dayEnd = Date.parse(temp.dayEnd);
                //we can updateOne for first element
                if (currentIndex == 0) {
                    scheduleNeedUpdate = {...temp };
                } else {
                    schedules.push(temp);
                }
            });
            let updateASchedule = Schedule.updateOne({ '_id': id }, scheduleNeedUpdate);
            let createSchedules = Schedule.insertMany(schedules);
            let createNotifDone = Notifs.create({
                forAll: true,
                userNameAthor: req.data.currentUser.fullName,
                userAthorAvatar: req.data.currentUser.image || '/images/default.png',
                url: '/schedules' + (rawSchedule.type == 0 ? '' : '/examination'),
                type: rawSchedule.type + 3,
            })

            Promise.all(updateASchedule, createSchedules, createNotifDone)
                .then(() => {
                    res.status(200).send('done');
                })
                .catch(next);
        } else {
            rawSchedule.dayStart = Date.parse(rawSchedule.dayStart);
            rawSchedule.dayEnd = Date.parse(rawSchedule.dayEnd);

            Schedule.updateOne({ '_id': id }, rawSchedule)
                .then(() => {
                    res.status(200).json('done');
                })
                .catch((err) => {
                    res.status(500).json('error');
                });
        }
    }
    today(req, res) {
        let userRole = req.data && req.data.currentUser && req.data.currentUser.role;
        let today = new Date();

        today = Date.parse(today);
        Schedule.find({
                dayStart: { $lt: today },
                dayEnd: { $gt: today }
            }).sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .then(schedules => {
                schedules = multipleMongooseToObjects(schedules);
                schedules.forEach(schedule => {
                    if (userRole && userRole < 3 || userRole == 0) {
                        schedule.linkMeet = schedule.linkMeet.map(function(link) {
                            return checkAndAddHttpSlash(link);
                        });
                        schedule.linkClass = schedule.linkClass.map(function(link) {
                            return checkAndAddHttpSlash(link);
                        });
                    } else {
                        schedule.linkMeet = schedule.linkMeet.map(function(link) {
                            return '/notPermission';
                        });
                        schedule.linkClass = schedule.linkClass.map(function(link) {
                            return '/notPermission';
                        });
                    }
                })
                schedules = schedules.map(function(schedule) {
                    schedule.dayStart = convertDateToDMY(schedule.dayStart);
                    schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                    return schedule;
                });
                res.send({ schedules });
            })
            .catch(next);
    }
    handleMultiAction(req, res) {
        let method = req.body.method;
        let scheduleIds = req.body.ids;
        console.log(method);
        switch (method) {
            case 'delete':
                {
                    Schedule.delete({ '_id': scheduleIds })
                    .then(
                        function(done) {
                            res.status(200).json('done');
                        }
                    )
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json('error');
                    });
                    break;
                }
            case 'restore':
                {
                    Schedule.restore({ '_id': scheduleIds })
                    .then(
                        function(done) {
                            res.status(200).json('done');
                        }
                    )
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json('error');
                    });
                    break;
                }
            case 'forceDelete':
                {
                    Schedule.deleteMany({ '_id': scheduleIds })
                    .then(
                        function(done) {
                            res.status(200).json('done');
                        }
                    )
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json('error');
                    });
                    break;
                }
        }
    }
    restore(req, res) {
        let id = req.params.id;

        Schedule.restore({ '_id': id })
            .then(() => {
                res.status(200).send('done');
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('error');
            });
    }
    trash(req, res) {
        let page = req.query.page;
        const type = req.query.type || 0;
        if (page < 1) {
            page = 1;
        }
        let perPage = +req.query.perPage || SCHEDULE_PER_PAGE;
        const numberOfSchedulesPass = (page - 1) * perPage;
        const schedulesDeleted = Schedule.findDeleted({ type })
            .sort({ dayOfWeek: "asc", partOfDay: "asc" })
            .limit(perPage)
            .skip(numberOfSchedulesPass);
        const countScheduleDeleted = Schedule.countDocumentsDeleted({ type });
        const countNotDeleted = Schedule.countDocuments({ type });

        Promise.all([schedulesDeleted, countScheduleDeleted, countNotDeleted])
            .then(([schedules, countCurrentStored, countOpositeStored]) => {
                schedules = multipleMongooseToObjects(schedules);

                schedules = schedules.map(function(schedule) {
                    schedule.dayStart = convertDateToDMY(schedule.dayStart);
                    schedule.dayEnd = convertDateToDMY(schedule.dayEnd);
                    schedule.linkMeet = schedule.linkMeet.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                    schedule.linkClass = schedule.linkClass.map(function(link) {
                        return checkAndAddHttpSlash(link);
                    });
                    return schedule;
                });
                res.send({ schedules, countCurrentStored, countOpositeStored });
            })
            .catch(() => {
                res.status(500).send('error');
            });
    }
    forceDeleteAnItem(req, res) {
        let id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            Schedule.findDeleted({ '_id': id }).remove()
                .then(
                    () => {
                        res.status(200).json('done');
                    }
                )
                .catch((err) => {
                    console.log(err);
                    res.status(500).json('error');
                });
        } else {
            console.log('id is not valid');
            res.status(500).json('id is not valid');
        }
    }
}

module.exports = new ScheduleController