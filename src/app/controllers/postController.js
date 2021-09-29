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
                res.redirect(`/posts/${data.slug}`);
            })
            .catch(err => {
                res.redirect('/500')
            });
    }
    storeAvatar(req, res, next) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        res.json({ secure_url: req.file.path });
    }
}
module.exports = new PostController;