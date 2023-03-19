const router = require('express').Router();

const Likes = require('../data/likes');
const { isLogged } = require('../middlewares/auth');

router.post("/", isLogged, async (req, res) => {

    let like = await Likes.findOne({ where: { userId: req.verify.user_id, videoId: req.body.videoId } });

    try {
        if (like) {
            await like.destroy();
            return res.status(200).send({ liked: false });
        } else {
            await Likes.create({ userId: req.verify.user_id, videoId: req.body.videoId });
            return res.status(200).send({ liked: true });
        }
    } catch (err) {
        return res.status(500).send({ msg: err })
    }
});


module.exports = router;