const siteRouter = require('./site');
const scheduleRouter = require('./schedule');

function route(app) {
    app.use('/schedule', scheduleRouter);
    app.use('/', siteRouter);
}

module.exports = route;