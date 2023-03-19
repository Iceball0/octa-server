const router = require('express').Router();

const Users = require('../data/users');
const { auth } = require('../middlewares/auth');

const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {

    let user = await Users.findOne({ where: { login: req.body.login } });
    
    if (user) 
        return res.status(500).send({ msg: "Пользователь с таким логином уже существует" });
    

    if ( req.body.pwd !== req.body.pwd2 )
        return res.status(500).send({ msg: "Пароли не совпадают" });

    const new_user = {
        login: req.body.login,
        username: req.body.name,
        hashed_password: "",
    }

    try {
        const hashed = await bcrypt.hash(req.body.pwd, 10);
        new_user.hashed_password = hashed;

        user = await Users.create(new_user);
        req.user = user;

        next();
    } catch (err) {
        return res.status(500).send({ msg: err });
    }

}, auth);

module.exports = router;