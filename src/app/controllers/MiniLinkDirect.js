const Link = require('../models/Link');
const validUrl = require('valid-url');
const shortid = require('shortid')
class MiniLinkDirect {
    index(req, res) {
        let shortUrl = req.params.link;

        Link.findOne({ shortUrl })
            .then(urlData => {
                let longUrl = urlData.longUrl;
                res.json({ longUrl });
            })
            .catch(err => {
                res.status(500).json({ err });
            })
    }
    create(req, res) {
        let url = req.body.url;
        if (!validUrl.isUri(url)) {
            return res.status(401).json('Invalid base URL')
        }
        let shortUrl = shortid.generate();
        let createLink = Link.create({
            longUrl: url,
            shortUrl: shortUrl
        });
        let checkWhetherLongUrlHasBeenStoredBefore = Link.findOne({ longUrl: url });

        createLink
            .then(() => {
                res.json({ shortUrl });
            })
            .catch(() => {
                checkWhetherLongUrlHasBeenStoredBefore
                    .then((data) => {
                        res.json({ shortUrl: data.shortUrl });
                    })
            })
    }
}

module.exports = new MiniLinkDirect;