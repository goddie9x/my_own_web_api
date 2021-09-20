class NewsController {
    index(req, res, next) {
        res.render('news/views');
    }
    create(req, res, next) {
        res.render('news/create');
    }
}
module.exports = new NewsController;