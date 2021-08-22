const siteRouter = require('./site');
const scheduleRouter = require('./schedule');

function route(app) {
    app.use('/schedules', scheduleRouter);
    app.use('/', siteRouter);
}

module.exports = route;