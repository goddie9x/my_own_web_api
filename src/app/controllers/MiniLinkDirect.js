const Link = require('../models/Link');
const validUrl = require('valid-url');
const shortid = require('shortid')
class MiniLinkDirect {
    index(req, res, next) {
        res.render('directLink/create');
    }
    link(req, res, next) {
        let shortUrl = req.params.link;

        Link.findOne({ shortUrl })
            .then(urlData => {
                let longUrl = urlData.longUrl;
                res.render('directLink/waiting', { longUrl });
            })
            .catch(err => {
                res.redirect('/404');
            })
    }
    create(req, res, next) {
        let url = req.body.url;

        if (!validUrl.isUri(url)) {
            return res.status(401).json('Invalid base URL')
        }
        // if valid, we create the url code
        let shortUrl = shortid.generate();
        Link.create({
                longUrl: url,
                shortUrl: shortUrl
            })
            .then(data => {
                res.send(shortUrl);
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = new MiniLinkDirect;