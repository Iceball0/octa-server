const router = require('express').Router();

const Subscribes = require('../data/subscribes');
const { isLogged } = require('../middlewares/auth');

router.post("/", isLogged, async (req, res) => {

    let sub = await Subscribes.findOne({ where: { userId: req.verify.user_id, channelId: req.body.channelId } });

    try {
        if (sub) {
            await sub.destroy();
            return res.status(200).send({ sub: false });
        } else {
            await Subscribes.create({ userId: req.verify.user_id, channelId: req.body.channelId });
            return res.status(200).send({ sub: true });
        }
    } catch (err) {
        return res.status(500).send({ msg: err })
    }
});


module.exports = router;