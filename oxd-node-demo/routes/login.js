var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '/../settings.json');
var oxd = require("oxd-node");
var properties = require('../properties');

router.post('/authenticate', function(req, res, next) {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return HTTP status as 401
    if (req.body.email == null || req.body.email == "") {
        res.send(400, {
            error: "Please provide email"
        });
        return;
    }
    if (req.body.password == null || req.body.password == "") {
        res.send(400, {
            error: "Please provide password"
        });
        return;
    }
    if (req.body.email == properties.username && req.body.password == properties.password) {
        jsonfile.readFile(setting, function(err, obj) {
            if (obj.oxd_id == null || obj.oxd_id == "")
                res.render('home.ejs', {
                    errorName: "",
                    errorMessage: "",
                    errorVisibility: "none"
                });
            else
                res.render('success.ejs', {
                    oxd_id: obj.oxd_id
                });
        });

    } else {
        res.render('login.ejs', {
            title: "Login",
            errorName: "Invalid User",
            errorMessage: "",
            errorVisibility: "block"
        });
    }
});

router.get('/logoutadmin', function(req, res, next) {
    res.render('login.ejs', {
        title: "Login",
        errorName: "",
        errorMessage: "",
        errorVisibility: "none"
    });
});


function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

router.post('/logoutuser', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.oxd_id = obj.oxd_id;
        var cookies = parseCookies(req);
        oxd.Request.post_logout_redirect_uri = "https://" + req.get('host');
        oxd.Request.session_state = cookies.ss;
        oxd.Request.state = cookies.state;
        oxd.get_logout_uri(oxd.Request, function(response) {
            if (response.length > 0) {
                res.status(200).send(response);
                return;
            }
        });
    });
});

router.get('/logout', function(req, res, next) {
    var mysession = req.session;
    mysession.access_token = null;
    res.clearCookie('client_id');
    res.clearCookie('ss');
    res.clearCookie('session_state');
    res.clearCookie('id_token');
    res.clearCookie('state');
    res.render('login.ejs', {
        title: "Login",
        errorName: "",
        errorMessage: "",
        errorVisibility: "none"
    });
});

router.get('/callrp', function(req, res, next) {
    res.render('rpframe.ejs');
});

router.get('/callop', function(req, res, next) {
    res.render('opframe.ejs');
});

module.exports = router;
