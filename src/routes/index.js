const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');
const postRouter = require('./post');
const checkUserLogin = require('../app/middlewares/checkUserLogin');
const miniLinkDirect = require('./miniLinkDirect');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', checkUserLogin, scheduleRouter);
    app.use('/posts', postRouter);
    app.use('/dir', miniLinkDirect);
    app.use('/', siteRouter);
}

module.exports = router;