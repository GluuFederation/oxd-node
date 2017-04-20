var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '/../settings.json');
var parameters = path.join(__dirname, '/../parameters.json');
var data = path.join(__dirname, '/../data.json');
var loginstatus = path.join(__dirname, '/../loginstatus.json');
var acrgroup = path.join(__dirname, '/../acr.json');
var oxd = require("oxd-node");
var properties = require('../properties');
var url = require('url');
var properties = require('../properties');

router.get('/', function(req, res) {
    res.render('index.ejs');
});

router.post('/Register', function(req, res){
    var scopes = [];
    scopes.push("openid");
    scopes.push("profile");
    scopes.push("email");
    if (req.body.scope_address == 1)
        scopes.push("address");
    if (req.body.scope_clientinfo == 1)
        scopes.push("clientinfo");
    if (req.body.scope_mobile == 1)
        scopes.push("mobile_phone");
    if (req.body.scope_phone == 1)
        scopes.push("phone");

    scopes.push("uma_protection")
    scopes.push("uma_authorization");



    if (scopes.length > 0)
        oxd.Request.scope = scopes;

    //Define acr_values
    var acr_value = [];
    var acr_value_array = {};
    var acr_basic = "none";
    var acr_gplus = "none";
    var acr_duo = "none";
    var acr_u2f = "none";
    var acr_connect = "none";
    if (req.body.oxd_openid_gplus_enable == 1) {
        acr_value.push("gplus");
        acr_value_array.gplus = "gplus";
        acr_connect = "block";
        acr_gplus = "block";
    }
    if (req.body.oxd_openid_basic_enable == 1) {
        acr_value.push("basic");
        acr_value_array.basic = "basic";
        acr_connect = "block";
        acr_basic = "block";
    }
    if (req.body.oxd_openid_duo_enable == 1) {
        acr_value.push("duo");
        acr_value_array.duo = "duo";
        acr_connect = "block";
        acr_duo = "block";
    }
    if (req.body.oxd_openid_u2f_enable == 1) {
        acr_value.push("u2f");
        acr_value_array.u2f = "u2f";
        acr_connect = "block";
        acr_u2f = "block";
    }

    jsonfile.writeFile(acrgroup, acr_value_array, function(err) {});
    jsonfile.writeFile(data, {});
    jsonfile.writeFile(loginstatus, {
        login: "false"
    });
    oxd.Request.client_id = null;
    oxd.Request.client_secret = null;
    oxd.Request.client_jwks_uri = null;
    oxd.Request.client_token_endpoint_auth_method = null;
    oxd.Request.client_request_uris = null;
    oxd.Request.client_logout_uris = [""];
    oxd.Request.client_sector_identifier_uri = null;
    oxd.Request.ui_locales = null;
    oxd.Request.claims_locales = null;
    oxd.Request.grant_types = ["authorization_code"];

    if (acr_value.length > 0)
        oxd.Request.acr_values = acr_value;

    var contacts = [];
    oxd.Request.contacts = contacts;
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.authorization_redirect_uri = req.body.redirectUrl;
        if(obj.oxd_id == ""){
            oxd.register_site(oxd.Request, function(response) {
                var responsedata = JSON.parse(response);
                if (responsedata.status == "ok") {
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function(err) {
                        jsonfile.readFile(parameters, function(err,parametersData) {
                            oxd.Request.authorization_redirect_uri = req.body.redirectUrl;
                            jsonfile.writeFile(parameters,oxd.Request, function(err) {
                                responsedata["redirectUrl"] = req.body.redirectUrl;
                                res.json(responsedata);
                            });
                        });
                    });
                }
                else{
                    var data = {"error":responsedata.data.error}
                     res.json(data);
                }
            });
        }
        else{
            var data = {};
            data["status"] = "done";
            jsonfile.readFile(parameters, function(err, obj) {
                data["redirectUrl"] = obj.authorization_redirect_uri;
                res.json(data); 
            });
        }
    });
});

router.post('/Update', function(req, res){
    
    var contacts = [];
    contacts.push(req.body.oxdEmail);
    oxd.Request.contacts = contacts;
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                parametersData.post_logout_redirect_uri = req.body.postLogoutRedirectUrl;
                parametersData.contacts = contacts;
                oxd.Request.oxd_id = obj.oxd_id;
                oxd.Request.post_logout_redirect_uri = req.body.postLogoutRedirectUrl;
                jsonfile.writeFile(parameters,parametersData,function(err){
                    oxd.update_site_registration(oxd.Request, function(response) {
                        res.json(response); 
                    });
                
                });
            });            
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.post('/GetAuthorizationUrl', function(req, res){
    
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                parametersData.post_logout_redirect_uri = req.body.postLogoutRedirectUrl;
                parametersData.contacts = req.body.oxdEmail;
                oxd.Request.oxd_id = obj.oxd_id;
                jsonfile.writeFile(parameters,parametersData,function(err){
                    oxd.get_authorization_url(oxd.Request, function(response) {
                        response = JSON.parse(response);
                        var data = {};
                        data['authorizationUrl'] = response.data.authorization_url;
                        res.json(data);
                    });
                
                });
            });            
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.post('/GetTokens', function(req, res){
    
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                parametersData.code = oxd.Request.code = req.body.authCode;
                parametersData.state = oxd.Request.state = req.body.authState;
                oxd.Request.oxd_id = obj.oxd_id;
                jsonfile.writeFile(parameters,parametersData,function(err){
                    oxd.get_tokens_by_code(oxd.Request, function(response) {
                        response = JSON.parse(response);
                        console.log(response);
                        var data = {};
                        data['accessToken'] = response.data.access_token;
                        data['refreshToken'] = response.data.refresh_token;
                        res.json(data);
                    });
                
                });
            });            
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.post('/GetUserInfo', function(req, res){
    
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.Request.access_token = req.body.accessToken;
            oxd.get_user_info(oxd.Request, function(response) {
                console.log(response);
                response = JSON.parse(response);
                var data = {};
                data['userName'] = response.data.claims.name[0];
                data['userEmail'] = response.data.claims.email[0];
                res.json(data);
            });          
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.post('/GetLogoutUri', function(req, res){
    
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.get_logout_uri(oxd.Request, function(response) {
                console.log(response);
                response = JSON.parse(response);
                var data = {};
                data['logoutUri'] = response.data.uri;
                console.log("response");
                console.log(data);
                res.json(data);
            });          
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});


module.exports = router;
