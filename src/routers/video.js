const router = require('express').Router();

const Videos = require('../data/videos');
const upload = require("../upload");

const jwt = require('jsonwebtoken')

router.post("/", async (req, res, next) => {
    const accessToken = req.get("Authorization").split(' ')[1];
    console.log(accessToken);
    var verify;
    try {
        verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err);
        return res.status(403).send({ msg: "Логин исчерпан" });
    }

    if (!verify) return res.status(403).send({ msg: "Логин исчерпан" });

    req.verify = verify;
    next();
}, upload.single("file"), async (req, res) => {

    if (!req.file) {
        return res.status(500).send({ msg: "Файл не найден" })
    } else {
        let userId = req.verify.user_id;
        let title = req.body.title;
        let description = req.body.description;
        let file_name = req.file.filename;

        await Videos.create({ userId, title, description, file_name });

        return res.status(200);
    }
});

module.exports = router;