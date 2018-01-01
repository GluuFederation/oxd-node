var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes/index');
var app = express();
var jsonfile = require('jsonfile');
var path = require('path');
var vhost = require('vhost');
var https = require('https');
var fs = require('fs');

dotenv.config();
app.use(session({
  secret: 'qwertyuiop',
  cookie: {
    maxAge: 300000
  },
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', routes);

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

app.use(vhost('client.example.com', app)); // Serves top level domain via Main server app

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

https.createServer(options, app).listen(process.env.PORT || 8000, function () {
  console.log('-----------------------\nServer started successfully!, Open this URL https://localhost:' + process.env.PORT + '\n-----------------------');
});
