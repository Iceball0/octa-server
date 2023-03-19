const router = require('express').Router();

const Videos = require('../data/videos');
const Users = require('../data/users');
const Likes = require('../data/likes');
const Subscribes = require('../data/subscribes');

const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {

    const accessToken = req.headers.authorization.split(' ')[1];
    var verify;
    try {
        verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
        verify = false;
    }

    const video = await Videos.findOne({ where: { id: req.body.id }, include: Users });
    if (video) {

        let liked = false;
        let subscribed = false;

        if (verify) {
            let user_id = verify.user_id;
            let likedData = await Likes.findOne({ where: { videoId: video.id, userId: user_id } });
            if (likedData) liked = true;

            let subscribedData = await Subscribes.findOne({ where: { channelId: video.User.id, userId: user_id } });
            if (subscribedData) subscribed = true;
        }

        let likes = await Likes.findAll({ where: { videoId: video.id } });
        let subscribes = await Subscribes.findAll({ where: { channelId: video.User.id } })
        return res.status(200).send({ video: {
            id: video.id,
            title: video.title,
            description: video.description,
            file_name: video.file_name,
            createdAt: video.createdAt,
            author: video.User.username, 
            channelId: video.User.id,
            likes: likes.length,
            liked: liked,
            subscribes: subscribes.length,
            subscribed: subscribed
        } });
    } else return res.status(404).send({ msg: 'Не найдено' });
});

module.exports = router;