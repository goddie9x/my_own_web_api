const Schedule = require('../models/Schedule');
const Post = require('../models/Post');
const User = require('../models/User');
const Common = require('../models/Common');
const Dashboard = require('../models/Dashboard');
const Image = require('../models/Image');
const { multipleMongooseToObjects } = require('../../utils/mongoose');
const getABriefPosts = require('../../utils/getABriefPosts');
const { destroySingleCloudinary } = require('../../config/cloudinary/cloudinary.config');
class SiteController {
    index(req, res) {
        let getNotifs = Post.find({ type: 2, publicType: 0, deleted: false }).sort({ updatedAt: -1 }).limit(6);
        let getPosts = Post.find({ type: 1, publicType: 0, deleted: false }).sort({ updatedAt: -1 }).limit(6);
        let getUsers = User.find({ account: { $regex: 'UHC.' } });

        Promise.all([getNotifs, getPosts, getUsers])
            .then(([NotifsRow, PostsRow, UsersRaw]) => {
                let listUser = multipleMongooseToObjects(UsersRaw);
                const users = listUser.map((User) => {
                    let { account, fullName, quote, ...user } = User;
                    account = account.replace('UHC', '');
                    return { account, fullName, quote };
                })
                const Notifs = multipleMongooseToObjects(NotifsRow);
                const Posts = multipleMongooseToObjects(PostsRow);

                const notifs = getABriefPosts(Notifs);
                const posts = getABriefPosts(Posts);
                res.send({ notifs, posts, users });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send('error');
            })
    }
    common(req, res) {
        Common.findOne({ active: true })
            .then(data => {
                res.send({ data });
            })
    }
    search(req, res) {
        const search = req.params.value;
        const regex = '.*' + search + '.*';
        let userFinded = User.find({ $or: [{ account: { $regex: regex } }, { fullName: { $regex: regex } }] });
        let schedulesFinded = Schedule.find({ name: { $regex: regex } });
        let postsFinded = Post.find({ title: { $regex: regex } });
        Promise.all([userFinded, schedulesFinded, postsFinded])
            .then(([users, schedules, posts]) => {
                let result = [];
                const usersResult = users.map((user) => {
                    const url = '/user/profile/' + user._id.toString();
                    const value = user.fullName || user.account;
                    return {
                        url,
                        value,
                        type: 'user'
                    }
                });
                const schedulesResult = schedules.map((schedule) => {
                    const url = '/schedules/edit/' + schedule._id.toString();
                    const value = schedule.name;
                    return {
                        url,
                        value,
                        type: 'schedule'
                    }
                });
                const postsResult = posts.map((post) => {
                    const url = '/posts/' + post._id.toString();
                    const value = post.title;
                    return {
                        url,
                        value,
                        type: 'post'
                    }
                });
                result = result.concat(usersResult, schedulesResult, postsResult);
                res.send({ result });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send('error');
            });
    }
    images(req, res) {
        let page = req.query.page || 1;
        if (page < 1) page = 1;
        const perPage = req.query.perPage || 12;
        const skip = (page - 1) * perPage;
        const imagesFind = Image.find({})
            .sort({ updatedAt: -1 })
            .limit(perPage)
            .skip(skip);
        const imagesCount = Image.countDocuments();
        Promise.all([imagesFind, imagesCount])
            .then(([rawImages, count]) => {
                let images = rawImages.map((image) => {
                    let { _id, url, ...imageObj } = image;
                    _id = _id.toString();
                    return { url, _id };
                });
                const totalPage = Math.ceil(count / perPage);
                res.json({ images, totalPage: totalPage });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send('error');
            });
    }
    cloudinaryDelete(req, res) {
        let image = req.params.image;
        if (image.match(/^[0-9a-fA-F]{24}$/)) {
            Image.findOneAndDelete({ _id: image })
                .then(() => {
                    destroySingleCloudinary(image, function(error, result) {
                        if (result) {
                            res.status(200).send(result);
                        } else {
                            res.status(500).send('error');
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.status(404).send('error');
                });
        } else {
            console.log('invalid id');
            res.status(404).send('error');
        }
    }
    cloudinary(req, res) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        //type 1: ckeditor, 2: image upload
        let url = req.file.path;
        let msg = 'Upload successfully';
        let funcNum = req.query.CKEditorFuncNum;
        Image.create({
                url: url,
                public_id: req.file.public_id
            })
            .then(data => {
                if (funcNum != undefined) {
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" +
                        funcNum + "','" + url + "','" + msg + "');</script>");
                } else {
                    res.status(201).json(url);
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).send('error');
            });
    }
    dashboard(req, res) {
        Dashboard.findOne({})
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send('error');
            });
    }
}
module.exports = new SiteController;