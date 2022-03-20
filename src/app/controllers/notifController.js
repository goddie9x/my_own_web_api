const Notifs = require('../models/Notification');
const NotificationRead = require('../models/NotificationRead');

const PER_PAGE_DEFAULT = 8;

class NotifcationController {
    index(req, res) {
        const userId = req.data && req.data.currentUser && req.data.currentUser._id;
        const currentUserFullName = req.data && req.data.currentUser && req.data.currentUser.fullName;
        const { page, perPage } = req.body;
        const PER_PAGE = +perPage || PER_PAGE_DEFAULT;
        const skip = (page - 1) * PER_PAGE;
        NotificationRead.findOne({ userId })
            .then(notifsRead => {
                let rawNotifsRead = notifsRead;
                if (!notifsRead) {
                    rawNotifsRead = { readNotifIds: [], viewedNotifIds: [] };
                }
                const { readNotifIds, viewedNotifIds } = rawNotifsRead;
                const countUnreadNotif = Notifs.countDocuments({
                    $or: [{ forUserId: userId },
                        { forAll: true }
                    ],
                    userNameAthor: { $ne: currentUserFullName },
                    _id: { $nin: viewedNotifIds }
                });
                const findNotif = Notifs.find({
                        $or: [{ forUserId: userId },
                            { forAll: true }
                        ],
                        userNameAthor: { $ne: currentUserFullName }
                    })
                    .sort({ createdAt: -1 })
                    .limit(PER_PAGE)
                    .skip(skip);
                return Promise.all([countUnreadNotif, findNotif])
                    .then(([amountNotifsNotRead, notifsRaw]) => {
                        const notifs = notifsRaw.map(notif => {
                            let read = false;
                            if (readNotifIds.includes(notif._id.toString())) {
                                read = true;
                            }
                            const {
                                _id,
                                userNameAthor,
                                userAthorAvatar,
                                url,
                                content,
                                type,
                                createdAt,
                            } = notif;
                            return {
                                _id,
                                userNameAthor,
                                userAthorAvatar,
                                url,
                                content,
                                read,
                                type,
                                createdAt
                            };
                        });
                        return { amountNotifsNotRead, notifs };
                    });
            })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: 'Something went wrong' });
            });
    }
    read(req, res) {
        const userId = req.data && req.data.currentUser && req.data.currentUser._id;
        const { notifId } = req.body;
        NotificationRead.findOne({ userId })
            .then(notifsRead => {
                if (notifsRead) {
                    const { readNotifIds } = notifsRead;
                    const newReadNotifIds = new Set([
                        ...readNotifIds, notifId
                    ]);
                    return NotificationRead.updateOne({ userId }, { readNotifIds: [...newReadNotifIds] });
                } else {
                    return NotificationRead.create({ userId, readNotifIds: [notifId], viewedNotifIds: [] });
                }
            })
            .then(() => {
                res.status(200).json({ message: 'Success' });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: 'Something went wrong' });
            });
    }
    view(req, res) {
        const userId = req.data && req.data.currentUser && req.data.currentUser._id;
        const { notifIds } = req.body;
        NotificationRead.findOne({ userId })
            .then(notifsRead => {
                const { viewedNotifIds } = notifsRead || { viewedNotifIds: [] };
                const newViewedNotifIds = new Set([
                    ...viewedNotifIds,
                    ...notifIds
                ]);
                return NotificationRead.updateOne({ userId }, { viewedNotifIds: [...newViewedNotifIds] });
            })
            .then(() => {
                res.status(200).json({ message: 'Success' });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: 'Something went wrong' });
            });
    }
}

module.exports = new NotifcationController();