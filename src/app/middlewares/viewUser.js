module.exports = function viewUser(req, res, next) {

    if (req._viewUser) {
        res.locals._viewUser = req._viewUser;

        if (res.locals._user.userID && req._viewUser == res.locals._user.userID) {
            res.locals._viewUser.editable = true;
        }
    }
    next();
}