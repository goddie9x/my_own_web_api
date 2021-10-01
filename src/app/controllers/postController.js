const Post = require('../models/Post');
const User = require('../models/User');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
class PostController {
    index(req, res, next) {
        Post.find({}).sort({ updatedAt: 'desc' })
            .then((data) => {
                let posts = multipleMongooseToObjects(data);
                posts = posts.map(post => {
                    delete post.content;
                    post.description = post.description.slice(0, 100);

                    return post;
                });
                res.render('posts/views', { posts });
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
    notifs(req, res, next) {
        Post.find({ type: 2 }).sort({ updatedAt: 'desc' })
            .then((data) => {
                data = data.map(post => {
                    delete post.content;
                    post.description = post.description.slice(0, 100);

                    return post;
                });
                res.send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
    news(req, res, next) {
        Post.find({ type: 1 }).sort({ updatedAt: 'desc' })
            .then((data) => {
                data = data.map(post => {
                    delete post.content;
                    post.description = post.description.slice(0, 100);

                    return post;
                });
                res.send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    }
    create(req, res, next) {
        res.render('posts/create');
    }
    delete(req, res, next) {
        console.log(res.locals.user.role);
        let slug = req.params.slug;
        console.log(slug);
        /* Post.delete({ slug })
            .then(data => {
                res.send('success');
            })
            .catch(err => {
                res.status(500).send('500');
            }) */
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
        console.log(req.files);
        let post = Object.assign(postInfo, {
            authorId: idUserCreatedPost,
            avatarUrl: (req.file) ? (req.file.path) : ('/images/default.png')
        });

        Post.create(post)
            .then(data => {
                res.redirect(`/posts/${data.slug}`);
            })
            .catch(err => {
                res.redirect('/500')
            });
    }
}
module.exports = new PostController;