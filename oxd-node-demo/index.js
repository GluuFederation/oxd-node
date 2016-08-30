var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var app = express();
var server = require('http').Server(app);
var oxd = require("oxd-node");
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '//settings.json');
var properties = require('./properties');

app.use(session({
    secret: 'asdfg1234',
    cookie: {
        maxAge: 300000
    },
    resave: true,
    saveUninitialized: true
}))
var mysession;

var https = require('https');
var fs = require('fs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/', index);

var options = {
    key: fs.readFileSync(__dirname + '//key.pem'),
    cert: fs.readFileSync(__dirname + '//cert.pem')
};

var a = https.createServer(options, app).listen(properties.app_port);
module.exports = app;
