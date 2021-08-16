const siteRouter = require('./site');

function route(app) {
    app.use('goddie9x.netlify.app', siteRouter);
}

module.exports = route;