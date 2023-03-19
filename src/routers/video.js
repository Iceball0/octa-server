const router = require('express').Router();

const Videos = require('../data/videos');
const upload = require("../upload");

router.post("/", async (req, res) => {
    const accessToken = req.get("Authorization").split(' ')[1];
    var verify;
    try {
        verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
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