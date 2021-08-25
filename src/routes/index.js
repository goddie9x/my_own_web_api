const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', scheduleRouter);
    app.use('/', siteRouter);
}

module.exports = router;