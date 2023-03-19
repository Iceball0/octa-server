const router = require('express').Router();

const Videos = require('../data/videos');
const Users = require('../data/users');
const Likes = require('../data/likes');

const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {

    var verify;
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
        if (err.message === 'jwt expired') return res.status(403).send({ msg: "Логин исчерпан" });
        verify = false;
    }

    var type = req.body.type;
    var videos

    if (verify) {

        let userId = verify.user_id;

        if (type === "Subscribes") {
            videos = await Videos.findAll({ include: Users });
        } else if (type === "Favourite") {
            
            videos = await Videos.findAll({ include: Users });
        } else if (type === "OwnVideo") {
            videos = await Videos.findAll({ where: {userId: userId}, include: Users });
        } else videos = await Videos.findAll({ include: Users });
    } else videos = await Videos.findAll({ include: Users });
    
    if (videos) {
        let result = [];
        videos.forEach(video => {
            result.push({
                id: video.id,
                title: video.title,
                description: video.description,
                file_name: video.file_name,
                createdAt: video.createdAt,
                author: video.User.username
            });
        });
        return res.status(200).send({ videos: result });
    } else return res.status(200).send({ videos: [] });
});

module.exports = router;