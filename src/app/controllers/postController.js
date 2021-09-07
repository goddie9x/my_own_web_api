class PostController {
    index(req, res, next) {
        res.render('posts/stored');
    }
}
module.exports = new PostController;