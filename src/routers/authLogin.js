const router = require('express').Router();

const Users = require('../data/users');
const { auth } = require('../middlewares/auth');

const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {

    req_login = req.body.user;
    const user = await Users.findOne({ where: { login: req_login } });

    if (user) {
        const isValidPwd = await bcrypt.compare(req.body.pwd, user.hashed_password);

        if (isValidPwd) {
            req.user = user;
            return next();
        }
    }

    return res.status(500).send({ msg: "Неправильный логин или пароль" });

}, auth);

module.exports = router;