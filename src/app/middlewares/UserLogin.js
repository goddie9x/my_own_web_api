module.exports = function userLoginMiddleware(req, res, next) {
    res.locals._user = {
        userID: false,
        imageUser: null,
        nameUser: "Default"
    };
    if (req.session.user) {
        res.locals._user = {
            userID: req.session.user.userID,
            imageUser: req.session.user.imageUser,
            nameUser: req.session.user.nameUser
        };
    }
    next();
}