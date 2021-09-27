const path = require('path');
const multiparty = require('multiparty');

class PostController {
    index(req, res, next) {
        res.render('posts/views');
    }
    create(req, res, next) {
        res.render('posts/create');
    }
    store(req, res, next) {
        //if user has uploaded avatar of post
        if (req.body.avatarUrl) {
            // folder upload
            let form = new multiparty.Form();
            form.parse(req, function(err, fields, files) {
                let img = files.image[0];
                let name = fields.name || img.originalFilename;
                const imagePath = path.join(__dirname, '/public/images');

                fs.rename(img.path, path, function(err) {
                    if (err) { return next(err); };
                    Photo.create({
                        name: name,
                        path: imagePath
                    }, function(err) {
                        if (err) { return next(err); };
                        res.redirect('/');
                    });
                });
            });
            // call class Resize
            const fileUpload = new Resize(imagePath);
            const filename = fileUpload.save(req.file.buffer);
            console.log(filename);
        } else {
            let idUserCreatedPost = req.data._id;
            let postInfo = req.body;
            let post = Object.assign(postInfo, {
                authorId: idUserCreatedPost
            });
            res.status(201).send(post);
        }
    }
}
module.exports = new PostController;