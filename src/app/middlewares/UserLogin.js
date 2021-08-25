module.exports = function userLoginMiddleware(req, res, next) {
    res.locals._user = {
        userID: false,
        imageUser: null,
        nameUser: "Default"
    };
    if (req._user) {
        res.locals._user = {
            userID: req._user.userID,
            imageUser: req._user.imageUser,
            nameUser: req._user.nameUser
        };
    }
    next();
}