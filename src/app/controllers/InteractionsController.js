const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');

class InteractionsController {
    handleReaction(req, res) {
        const currentUser = req.data.currentUser;
        const { targetId, reactionType } = req.body;
        const query = { targetId, userId: currentUser._id };
        Reaction.findOne(query)
            .then((response) => {
                if (response) {
                    if (reactionType > 5) {
                        const prevReaction = response.reactionType;
                        const removeReactionFromPost = Post.findByIdAndUpdate(targetId, {
                            reactions: {
                                $inc: {
                                    [prevReaction]: -1
                                }
                            }
                        });
                        const removeReactionFromComment = Comment.findByIdAndUpdate(targetId, {
                            reactions: {
                                $inc: {
                                    [prevReaction]: -1
                                }
                            }
                        });
                        const removeCurrentReaction = response.remove();
                        Promise.all([removeReactionFromPost, removeReactionFromComment, removeCurrentReaction])
                            .then(() => {
                                res.status(200).send('success');
                                return;
                            })
                            .catch((e) => {
                                console.log(e);
                                res.status(500).send('error');
                            });
                    } else {
                        response.reactionType = reactionType;
                        const updateReaction = response.save();
                        const updateReactionInPost = Post.findByIdAndUpdate(targetId, {
                            reactions: {
                                $inc: {
                                    [reactionType]: 1
                                }
                            }
                        });
                        const updateReactionInComment = Comment.findByIdAndUpdate(targetId, {
                            reactions: {
                                $inc: {
                                    [reactionType]: 1
                                }
                            }
                        });
                        Promise.all([updateReaction, updateReactionInPost, updateReactionInComment])
                            .then(() => {
                                res.status(200).send('success');
                                return;
                            })
                            .catch((e) => {
                                console.log(e);
                                res.status(500).send('error');
                            });
                    }
                } else {
                    Reaction.create({
                            targetId,
                            userId: currentUser._id,
                            reactionType,
                        })
                        .then(() => {
                            res.status(200).send('success');
                            return;
                        })
                        .catch((e) => {
                            console.log(e);
                            res.status(500).send('error');
                        });
                }
            })
            .catch((e) => {
                console.log(e);
                res.status(500).send('error');
            });
    }
    handleComment(req, res) {
        const currentUser = req.data.currentUser;
        const { targetId, content } = req.body;
        const query = { targetId, userId: currentUser._id };
        Comment.findOne(query)
            .then((response) => {
                if (response) {
                    response.content = content;
                    response.save()
                        .then(() => {
                            res.status(200).send('success');
                            return;
                        })
                        .catch((e) => {
                            console.log(e);
                            res.status(500).send('error');
                        });
                } else {
                    Comment.create({
                            targetId,
                            userId: currentUser._id,
                            content,
                        })
                        .then(() => {
                            res.status(200).send('success');
                            return;
                        })
                        .catch((e) => {
                            console.log(e);
                            res.status(500).send('error');
                        });
                }
            })
            .catch((e) => {
                console.log(e);
                res.status(500).send('error');
            });
    }
    getComments(req, res) {
        const { targetId } = req.params;
        Comment.find({ targetId })
            .then((response) => {
                res.status(200).json(response);
                return;
            })
            .catch((e) => {
                console.log(e);
                res.status(500).send('error');
            });
    }
}

module.exports = new InteractionsController;