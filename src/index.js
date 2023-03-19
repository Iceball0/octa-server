const express = require('express');
const cors = require('cors');

const Fingerprint = require('express-fingerprint');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const sequelize = require('./data/database');

require('dotenv').config();
const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(Fingerprint());
app.use(useragent.express());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./routers/index'));


sequelize.sync().then(() => {
    console.log('Database is ready');
}).catch((error) => {
    console.error('Failed to connect to the database: ', error);
});


const PORT = process.env.PORT || 3080;

const server = app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`)
});