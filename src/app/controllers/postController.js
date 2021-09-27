const path = require('path');
const Resize = require('../../utils/Resize');
class PostController {
    index(req, res, next) {
        res.render('posts/views');
    }
    create(req, res, next) {
        res.render('posts/create');
    }
    store(req, res, next) {
        //if user has uploaded avatar of post
        if (req.file) {
            // folder upload
            const imagePath = path.join(__dirname, '/public/images');
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