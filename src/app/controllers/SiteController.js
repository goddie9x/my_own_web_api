const Schedule = require('../models/Schedule');
const { multipleMongooseToObjects } = require('../../util/mongoose');
class SiteController {

    index(req, res, next) {
        res.render('home');
    }
    search(req, res) {
        res.render('search');
    }
}
module.exports = new SiteController();