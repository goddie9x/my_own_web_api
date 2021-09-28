const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
class PostController {
    index(req, res, next) {
        res.render('posts/views');
    }
    create(req, res, next) {
        res.render('posts/create');
    }
    viewPost(req, res, next) {
        let slug = req.params.slug;

        Post.findOne({ slug })
            .then(async function(data) {
                let authorId = data.authorId;
                let author = await User.findOne({ _id: authorId })

                data = Object.assign(data, {
                    author: author.name,
                })
                return data
            })
            .then(data => {
                res.render('posts/viewPost', data);
            })
            .catch(err => {
                res.redirect('/404');
            })
    }
    store(req, res, next) {
        let idUserCreatedPost = req.data._id;
        let postInfo = req.body;
        let avatarUrl = postInfo.avatarUrl;
        let post = Object.assign(postInfo, {
            authorId: idUserCreatedPost,
        });
        if (avatarUrl) {
            avatarUrl = '/images/' + avatarUrl;
            post.avatarUrl = avatarUrl;
        }

        Post.create(post)
            .then(data => {
                res.redirect(`/posts/${postInfo.slug}`);
            })
            .catch(err => {
                res.redirect('/500')
            });
    }
    storeAvatar(req, res, next) {
        try {
            fs.readFile(req.files.file.path, function(err, data) {
                var newPath = path.join(__dirname, '../../public/images/' + req.files.file.name);
                fs.writeFile(newPath, data, function(err) {
                    if (err) console.log({ err: err });
                    else {
                        let fileName = req.files.file.name;
                        let url = '/images/' + fileName;
                        res.status(201).send(url);
                    }
                });
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
module.exports = new PostController;