const Link = require('../models/Link');

class MiniLinkDirect {
    index(req, res, next) {
        res.render('directLink/create');
    }
    link(req, res, next) {
        let shortUrl = req.params.link;

        Link.findOne({ shortUrl })
            .then(urlData => {
                res.send(urlData);
            })
            .catch(err => {
                res.redirect('/404');
            })
    }
    create(req, res, next) {
        let url = req.body.url;


        Link.create({
            url: url,
            shortUrl: url
        })

        res.send(url);
    }
}

module.exports = new MiniLinkDirect;