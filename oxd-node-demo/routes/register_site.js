var oxd = require("oxd-node");
var express = require('express');
var router = express.Router();
var url = require('url');
var jsonfile = require('jsonfile');
var path = require('path');
var properties = require('../properties');

var setting = path.join(__dirname, '/../settings.json');
router.post('/register_site', function(req, res, next) {

    if (!req.secure) {
        res.send(400, {
            error: "This connection is untrusted, your host should be with https"
        });
        return;
    }

    console.log("-------register_site-----------------------------------");
    console.log(JSON.stringify(req.body));

    if (req.body.email == null || req.body.email == "") {
        res.send(400, {
            error: "Please provide email"
        });
        return;
    }
    //Define scopes
    var scopes = [];
    scopes.push("openid");

    if (req.body.scope_profile == 1)
        scopes.push("profile");
    if (req.body.scope_email == 1)
        scopes.push("email");
    if (req.body.scope_address == 1)
        scopes.push("address");
    if (req.body.scope_clientinfo == 1)
        scopes.push("clientinfo");
    if (req.body.scope_mobile == 1)
        scopes.push("mobile_phone");
    if (req.body.scope_phone == 1)
        scopes.push("phone");

    if (scopes.length > 0)
        oxd.Request.scope = scopes;

    //Define acr_values
    var acr_value = [];
    if (req.body.oxd_openid_gplus_enable == 1)
        acr_value.push("gplus");
    if (req.body.oxd_openid_basic_enable == 1)
        acr_value.push("basic");
    if (req.body.oxd_openid_duo_enable == 1)
        acr_value.push("duo");
    if (req.body.oxd_openid_u2f_enable == 1)
        acr_value.push("u2f");

    oxd.Request.op_host = properties.op_host;
    oxd.Request.authorization_redirect_uri = "https://" + req.get('host');
    oxd.Request.post_logout_redirect_uri = "https://" + req.get('host');
    oxd.Request.redirect_uris = ["https://" + req.get('host')];
    oxd.Request.client_id = null;
    oxd.Request.client_secret = null;
    oxd.Request.client_jwks_uri = null;
    oxd.Request.client_token_endpoint_auth_method = null;
    oxd.Request.client_request_uris = null;
    oxd.Request.client_logout_uris = ["https://" + req.get('host') + "/logout"];
    oxd.Request.client_sector_identifier_uri = null;
    oxd.Request.ui_locales = null;
    oxd.Request.claims_locales = null;
    oxd.Request.grant_types = ["authorization_code"];

    if (acr_value.length > 0)
        oxd.Request.acr_values = acr_value;


    var contacts = [];
    contacts.push(req.body.email);
    oxd.Request.contacts = contacts;

    jsonfile.readFile(setting, function(err, obj) {
        if (obj.oxd_id == null || obj.oxd_id == "") {
            oxd.register_site(oxd.Request, function(response) {
                var responsedata = JSON.parse(response);
                if (responsedata.status == "ok") {
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function(err) {});
                    res.render('success.ejs', {
                        oxd_id: responsedata.data.oxd_id
                    });
                } else {
                    res.render('home.ejs', {
                        errorName: "Error : ",
                        errorMessage: JSON.stringify(responsedata),
                        errorVisibility: "block"
                    });
                }
            });
        } else {
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.update_site_registration(oxd.Request, function(response) {
                var responsedata = JSON.parse(response);
                if (responsedata.status == "ok") {
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function(err) {});
                    console.log("-------Update Successfully-------");
                    res.render('success.ejs', {
                        oxd_id: responsedata.data.oxd_id
                    });
                } else {
                    res.render('home.ejs', {
                        errorName: "Error : ",
                        errorMessage: JSON.stringify(responsedata),
                        errorVisibility: "block"
                    });
                }
            });
        }
    });
});

router.post('/updateSite', function(req, res, next) {
    res.render('home.ejs', {
        errorName: "",
        errorMessage: "",
        errorVisibility: "none"
    });
});

router.post('/get_url_gplus', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.acr_values = ["gplus"];
        oxd.get_authorization_url(oxd.Request, function(response) {
            if (response.length > 0) {
                res.status(200).send(response);
                return;
            }
        });
    });
});

router.post('/get_url_basic', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        if (err) {
            return {
                "error": "error"
            }
        };
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.acr_values = ["basic"];
        oxd.get_authorization_url(oxd.Request, function(response) {
            if (response.length > 0) {
                return res.status(200).send(response);
                res.end();
            }
        });
    });
});

router.post('/get_url_duo', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.acr_values = ["duo"];
        oxd.get_authorization_url(oxd.Request, function(response) {
            if (response.length > 0) {
                res.status(200).send(response);
                return;
            }
        });
    });
});

router.post('/get_url_u2f', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.acr_values = ["u2f"];
        oxd.get_authorization_url(oxd.Request, function(response) {
            if (response.length > 0) {
                res.status(200).send(response);
                return;
            }
        });
    });
});

router.get('/get_user_info', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        var mysession = req.session;
        if (mysession.access_token != null) {
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.Request.access_token = mysession.access_token;
            oxd.get_user_info(oxd.Request, function(response) {
                if (response.length > 0) {
                    var jsondata = JSON.parse(response);
                    if (jsondata.status == "ok") {
                        var claims = jsondata.data.claims;
                        if (Object.keys(claims).length > 0) {
                            res.render("user.ejs", {
                                email: jsondata.data.claims.email[0]
                            })
                        } else {
                            res.redirect("logout");
                        }
                    } else {
                        res.render('login.ejs', {
                            title: "Login",
                            errorName: "",
                            errorMessage: "",
                            errorVisibility: "none"
                        });
                    }
                }
            });
        } else {
            res.render('login.ejs', {
                title: "Login",
                errorName: "",
                errorMessage: "",
                errorVisibility: "none"
            });
        }
    });

});

module.exports = router;
