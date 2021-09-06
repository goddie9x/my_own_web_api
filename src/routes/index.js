const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');
const newsRouter = require('./news');
const checkUserLogin = require('../app/middlewares/checkUserLogin');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', checkUserLogin, scheduleRouter);
    app.use('/news', newsRouter);
    app.use('/', siteRouter);
}

module.exports = router;