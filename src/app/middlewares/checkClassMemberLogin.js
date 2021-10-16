module.exports = function checkModLoginMiddleware(req, res, next) {
    let user = req.data;
    if (user.role < 3) {
        next();
    } else {
        res.status(500).redirect('/notPermission');
    }
}