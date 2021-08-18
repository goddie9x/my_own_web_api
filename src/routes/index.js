const serverless = require('serverless-http');
const siteRouter = require('./site');

function route(app) {
    app.use('/', siteRouter);
}

module.exports = route;