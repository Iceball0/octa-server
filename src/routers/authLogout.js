const router = require('express').Router();

const RefreshSessions = require('../data/refreshSessions');
const { deauth } = require('../middlewares/auth');

router.post('/', async (req, res, next) => {

    try {
        const { cookie } = req.headers;
        let old_refreshToken = cookie?.split('=')[1];
        
        RefreshSessions.destroy({ where: { refreshToken: old_refreshToken } });
        next();
    } catch (err) {
        next();
    }

}, deauth);

module.exports = router;