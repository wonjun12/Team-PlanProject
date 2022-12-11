const express = require('express');
const bodyParser = require('body-parser');
const session =require('express-session');
const mongoStore = require('connect-mongo');

const app = express();

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
    secret: process.env.COOKIE_SECERT,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({mongoUrl : process.env.DB_URL})
}))

module.exports = app;