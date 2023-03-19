const router = require('express').Router();

const RefreshSessions = require('../data/refreshSessions');
const Users = require('../data/users');

const refreshTokenF = async (req, res) => {
    try {
        const { cookie } = req.headers;
        let old_refreshToken = cookie?.split('=')[1];
        
        var session = await RefreshSessions.findOne({ where: {refreshToken: old_refreshToken} });
        await session.destroy();

        res.clearCookie('refreshToken');

        if (!RefreshSessions.verifyExpiration(session)) return res.status(401).send({ msg: "Токен закончился" });
        if (!RefreshSessions.verifyFingerprint(session, req.fingerprint.hash)) return res.status(401).send({ msg: "Неверная сессия" });

        var user = await Users.findOne({ where: { id: session.userId } });

        const { accessToken, refreshToken, expiresIn } = await RefreshSessions.generateToken(user, req.fingerprint.hash, req.useragent.source);

        return res.status(200)
        .cookie('refreshToken', refreshToken, {
            path: "/api/auth",
            expires: new Date(new Date().getTime() + expiresIn * 1000),
            httpOnly: true,
            sameSite: 'strict',
            // secure: true
        })
        .send({
            accessToken
        });

    } catch (err) {
        res.status(401).send({ msg: "Неавторизован" });
    }
}

router.post('/', async (req, res) => {
    refreshTokenF(req, res);
})

router.get('/', async (req, res) => {
    refreshTokenF(req, res);
})

module.exports = router;