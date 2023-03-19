const router = require('express').Router();

router.use('/auth/logout', require('./authLogout'));
router.use('/auth/login', require('./authLogin'));
router.use('/auth/signup', require('./authSignup'));
router.use('/auth/refresh', require('./authRefreshToken'));

router.use('/subscribes', require('./Subscribes'));
router.use('/likes', require('./Likes'));
router.use('/videos', require('./getVideos'));
router.use('/video', require('./getVideo'));
router.use('/upload_file', require('./video'));

router.get("/video/:name", (req, res) => {
    res.sendFile('/upload/' + req.params.name, { root: '.' });
});

module.exports = router;