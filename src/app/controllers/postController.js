const Post = require('../models/Post');
const Notifs = require('../models/Notification');
const Dashboard = require('../models/Dashboard');
const toc = require("@pakjiddat/toc/index");
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const PER_PAGE_DEFAULT = 8;
class PostController {
    index(req, res) {
        const currentUser = req.data ? req.data.currentUser : undefined;
        const userRole = currentUser ? req.data.currentUser.role : 4;
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
            const amount = Post.countDocuments(query);
            const posts = Post.find(query).sort({ updatedAt: 'desc' })
                .limit(limit)
                .skip(skip);
            Promise.all([amount, posts])
                .then(([amount, rawPosts]) => {
                    let posts = multipleMongooseToObjects(rawPosts);
                    posts = posts.map(function(post) {
                        delete post.content;
                        post.description = post.description.slice(0, 200);
                        return post;
                    });
                    res.send({ posts, amount });
                    return;
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('error');
                });
        }
    }
    delete(req, res) {
        const currentUser = req.data.currentUser;
        const slug = req.params.slug;
        const query = { slug };
        if (currentUser.role > 2) {
            query.authorId = currentUser._id;
        }
        Post.findOneAndRemove(query)
            .then((response) => {
                if (response) {
                    Dashboard.findOneAndUpdate({}, { $inc: { amountPost: -1, amountPostPerMonth: -1 } })
                        .then(() => {
                            res.send('success');
                        })
                        .catch((e) => {
                            console.log(e);
                            res.send('success');
                        });
                } else {
                    res.status(500).send('error');
                }
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
        const currentUser = req.data.currentUser;
        const postInfo = req.body;
        const contentGen = toc.Generate(postInfo.content);
        const content = contentGen.updatedText ? contentGen.updatedText : postInfo.content;
        const headingList = contentGen.tocList ? contentGen.tocList : '';
        const slug = req.params.slug;
        let post = Object.assign(postInfo, {
            author: currentUser.fullName || currentUser.username,
            authorAvatar: currentUser.image || '/images/default.png',
            authorQuote: currentUser.quote,
            authorId: currentUser._id,
            content,
            headingList,
        });
        if (slug) {
            post = Object.assign(postInfo, {
                slug,
            });
            let handlePostDone = Post.updateOne({ slug }, post);
            let createNotifDone = Notifs.create({
                userNameAthor: currentUser.fullName || currentUser.username,
                userAthorAvatar: currentUser.image || '/images/default.png',
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
                            userNameAthor: currentUser.fullName || currentUser.username,
                            userAthorAvatar: currentUser.image || '/images/default.png',
                            forAll: postInfo.type == 1,
                            url: '/posts/' + slug,
                            type: postInfo.type,
                        })
                        .then(() => {
                            Dashboard.findOneAndUpdate({}, { $inc: { amountPost: 1, amountPostPerMonth: 1 } })
                                .then(() => {
                                    res.status(200).json(post.slug);
                                })
                                .catch((e) => {
                                    console.log(e);
                                    res.status(200).json(post.slug);
                                });
                            return;
                        });
                })
                .catch((e) => {
                    console.log(e);
                    res.status(500).send('error');
                });
        }
    }
    handleMultiAction(req, res) {
        const currentUser = req.data.currentUser;
        const { action, postIds } = req.body;
        const query = {
            _id: { $in: postIds },
        };
        if (currentUser.role > 2) {
            query.authorId = currentUser._id;
        }
        switch (action) {
            case 'delete':
                Post.deleteMany(query)
                    .then((data) => {
                        const amount = data.deletedCount;
                        Dashboard.findOneAndUpdate({}, { $inc: { amountPost: -amount, amountPostPerMonth: -amount } })
                            .finally(() => {
                                res.status(200).send('success');
                            });
                    })
                    .catch((e) => {
                        console.log(e);
                        res.status(500).send('error');
                    });
                break;
        }
    }
}
module.exports = new PostController;