const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');
const checkUserLogin = require('../app/middlewares/checkUserLogin');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', checkUserLogin, scheduleRouter);
    app.use('/', siteRouter);
}

module.exports = router;