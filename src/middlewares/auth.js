const RefreshSessions = require('../data/refreshSessions');

const jwt = require('jsonwebtoken');

// auth users
exports.auth = async (req, res) => {
    const { accessToken, refreshToken, expiresIn } = await RefreshSessions.generateToken(req.user, req.fingerprint.hash, req.useragent.source);

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
}

exports.deauth = async (req, res) => {

    res.clearCookie('refreshToken', {
        path: "/api/auth"
    });
    return res.status(200)
    .send({ msg: "Успешно" });
}

exports.isLogged = async (req, res, next) => {

    const accessToken = req.headers.authorization.split(' ')[1];
    var verify;
    try {
        verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(403).send({ msg: "Логин исчерпан" });
    }

    if (!verify) return res.status(403).send({ msg: "Логин исчерпан" });

    req.verify = verify;
    next();
}