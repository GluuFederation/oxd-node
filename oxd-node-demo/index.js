var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var login = require('./routes/login');
var register_site = require('./routes/register_site');
var app = express();
var server = require('http').Server(app);
var oxd = require("oxd-node");
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '//settings.json');

app.use(session({ secret: 'asdfg1234', cookie: { maxAge: 300000 }, resave: true, saveUninitialized: true }))
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

app.get('/', function (req, res) {
        if(req.query.code != null)
        {
          jsonfile.readFile(setting, function(err, obj) {
              res.cookie('ss',req.query.session_state, { maxAge: 900000, httpOnly: false });
              oxd.Request.oxd_id = obj.oxd_id;
              oxd.Request.code = req.query.code;
              oxd.Request.scopes = req.query.scope.split(/[ ]+/);
              oxd.Request.state = req.query.state;
              oxd.get_tokens_by_code(oxd.Request,function(response){
                    var jsondata = JSON.parse(response);
                    var mysession = req.session;
                    mysession.access_token = jsondata.data.access_token;
                    //res.cookie('id_token',jsondata.data.id_token, { maxAge: 900000, httpOnly: false });
                    if(jsondata.data.access_token != null && jsondata.status == "ok"){
                      res.redirect("get_user_info");
                    }
                    else {
                      res.render('login.ejs', { title: "Login", errorName: "" , errorMessage : "", errorVisibility: "none" });
                    }
              });
          });
        }
        else {
            res.render('login.ejs', { title: "Login", errorName: "" , errorMessage : "", errorVisibility: "none" });
        }
});

app.use('/',login);
app.use('/',register_site);

var options = {
  key: fs.readFileSync(__dirname+'//key.pem'),
  cert: fs.readFileSync(__dirname+'//cert.pem')
};

var a = https.createServer(options, app).listen(5053);
module.exports = app;
