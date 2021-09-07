const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');
const postRouter = require('./post');
const newsRouter = require('./news');
const checkUserLogin = require('../app/middlewares/checkUserLogin');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', checkUserLogin, scheduleRouter);
    app.use('/news', newsRouter);
    app.use('/posts', postRouter);
    app.use('/', siteRouter);
}

module.exports = router;