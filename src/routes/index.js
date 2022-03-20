const siteRouter = require('./site');
const scheduleRouter = require('./schedule');
const userRouter = require('./user');
const postRouter = require('./post');
const miniLinkDirectRouter = require('./miniLinkDirect');
const notificationRouter = require('./notification');
const ChatRoomRouter = require('./chatRoom');

function router(app) {
    app.use('/user', userRouter);
    app.use('/schedules', scheduleRouter);
    app.use('/posts', postRouter);
    app.use('/dir', miniLinkDirectRouter);
    app.use('/notif', notificationRouter);
    app.use('/chat-room', ChatRoomRouter);
    app.use('/', siteRouter);
}

module.exports = router;