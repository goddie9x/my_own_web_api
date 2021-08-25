module.exports = function getBreadcrumbs(req, res, next) {
    if (req.originalUrl.includes('search')) {
        res.locals.breadcrumbs = {
            breadcrumbName: 'search',
            breadcrumbUrl: 'none',
        };
        next();
        return;
    }

    const urls = req.originalUrl.split('/');

    if (req.originalUrl.includes('modify')) {
        urls.pop();
    }

    urls.shift();

    res.locals.breadcrumbs = urls.map((url, i) => {
        return {
            breadcrumbName: (url === '' ? 'Home' : url.charAt(0).toUpperCase() + url.slice(1)),
            breadcrumbUrl: `/${urls.slice(0, i + 1).join('/')}`,
        };
    });
    next();
}