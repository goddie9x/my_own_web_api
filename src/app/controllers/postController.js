const Post = require('../models/Post');
const Notifs = require('../models/Notification');
const toc = require("@pakjiddat/toc/index");
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const PER_PAGE_DEFAULT = 8;
class PostController {
    index(req, res) {
        const userRole = req.data && req.data.currentUser && req.data.currentUser.role || 4;
        const { userId } = req.body;
        if (userId == 'nope') {
            res.status(200).send([]);
            return;
        } else {
            const { type, tag, page } = req.query;
            const limit = req.query.limit || PER_PAGE_DEFAULT;
            const skip = limit * (page - 1);
            const query = userRole < 3 ? {} : { publicType: 0 };
            if (tag) {
                query.tag = tag;
            }
            if (userId) {
                query.authorId = userId;
            }
            if (type) {
                query.type = type;
            }
            console.log(query);
            Post.find(query).sort({ updatedAt: 'desc' })
                .limit(limit)
                .skip(skip)
                .then((data) => {
                    let posts = multipleMongooseToObjects(data);
                    posts = posts.map(function(post) {
                        delete post.content;
                        post.description = post.description.slice(0, 200);
                        return post;
                    });
                    res.send(posts);
                    return;
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('error');
                });
        }
    }
    delete(req, res) {
        const currentUserId = req.data.currentUser._id;
        const slug = req.params.slug;

        Post.findOneAndRemove({ slug, authorId: currentUserId })
            .then(() => {
                res.send('success');
            })
            .catch(() => {
                res.status(500).send('500');
            });
    }
    viewPost(req, res) {
        const slug = req.params.slug;
        const role = req.data ? req.data.currentUser.role : 4;
        const query = role < 3 ? { slug } : { slug, publicType: 0 };
        Post.findOne(query)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    }
    store(req, res) {
        const userCreatedPost = req.data.currentUser.fullName;
        const authorAvatar = req.data.currentUser.image || '/images/default.png';
        const authorQuote = req.data.currentUser.quote;
        const authorId = req.data.currentUser._id;
        const postInfo = req.body;
        const contentGen = toc.Generate(postInfo.content);
        const content = contentGen.updatedText ? contentGen.updatedText : postInfo.content;
        const headingList = contentGen.tocList ? contentGen.tocList : '';
        const slug = req.params.slug;
        let post = Object.assign(postInfo, {
            author: userCreatedPost,
            authorAvatar,
            authorQuote,
            authorId,
            content,
            headingList,
        });
        if (slug) {
            post = Object.assign(postInfo, {
                slug,
            });
            let handlePostDone = Post.updateOne({ slug }, post);
            let createNotifDone = Notifs.create({
                userNameAthor: userCreatedPost,
                userAthorAvatar: authorAvatar,
                forAll: postInfo.type == 1,
                url: '/posts/' + slug,
                type: postInfo.type,
            });
            Promise.all([createNotifDone, handlePostDone])
                .then(() => {
                    res.status(200).json(slug);
                    return;
                })
                .catch((e) => {
                    console.log(e);
                    res.status(500).send('error');
                });
        } else {
            Post.create(post)
                .then((post) => {
                    return Notifs.create({
                            userNameAthor: userCreatedPost,
                            userAthorAvatar: authorAvatar,
                            forAll: postInfo.type == 1,
                            url: '/posts/' + post.slug,
                            type: postInfo.type,
                        })
                        .then(() => {
                            res.status(200).json(post.slug);
                            return;
                        });
                })
                .catch((e) => {
                    console.log(e);
                    res.status(500).send('error');
                });
        }
    }
}
module.exports = new PostController;