class NewsController {
    index(req, res, next) {
        res.render('news/views');
    }
}
module.exports = new NewsController;