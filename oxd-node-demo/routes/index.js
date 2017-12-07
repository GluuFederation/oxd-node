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
var httpRequest = require('request');
var protectedResource = "";

router.get('/settings', function(req, res) {
    jsonfile.readFile(setting, function(err, obj) {
        jsonfile.readFile(parameters, function(err, objRpConfig) {
            res.render('settings',{oxdObject : obj, oxdRpConfig : objRpConfig});
        });
    });
});

router.post('/getProtectedResource', function(req, res) {
    console.log(req.body.protected_resource);
//    return false;
    jsonfile.readFile(setting, function(err, obj) {
        jsonfile.readFile(parameters, function(err, objRpConfig) {
            obj.protected_resource_url = req.body.protected_resource;
            jsonfile.writeFile(setting, obj, function() {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                console.log(req.body);
                var options = {
                    url: req.body.protected_resource
                };

                httpRequest.post(options ,function (error, response, ticket) {
                    console.log("ticket: "+ticket);
                    oxd.Request.op_host = objRpConfig.op_host;
                    oxd.Request.oxd_id = obj.oxd_id;
                    oxd.Request.client_id = obj.client_id;
                    oxd.Request.client_secret = obj.client_secret;
                    if(obj.conn_type == "local"){
                        var url = "";
                    }else if(obj.conn_type == "web"){
                        var url = objRpConfig.httpBaseUrl+"/get-client-token";
                    }
                    oxd.Request.url = url;
                    oxd.get_client_access_token(oxd.Request, function(access_token_response){
                        var access_token_data = JSON.parse(access_token_response);
                        oxd.Request.protection_access_token = access_token_data.data.access_token;
                        oxd.Request.ticket = ticket;
                        if(obj.conn_type == "local"){
                            var url = "";
                        }else if(obj.conn_type == "web"){
                            var url = objRpConfig.httpBaseUrl+"/uma-rp-get-rpt";
                        }
                        oxd.uma_rp_get_rpt(oxd.Request, function(get_rpt_response){
                            var objGet_rpt_response = JSON.parse(get_rpt_response);
                            if(objGet_rpt_response.status == "error" && objGet_rpt_response.data.error == "need_info"){
                                var rptTicket = objGet_rpt_response.data.details.ticket;
                                oxd.Request.ticket = rptTicket;
                                oxd.Request.claims_redirect_uri = req.protocol+"://"+req.hostname+":"+properties.app_port+"/claims_gathering_redirect";
                                oxd.uma_rp_get_claims_gathering_url(oxd.Request, function(get_claims_gathering_response){
                                    console.log(get_rpt_response);
                                    var objGet_claims_gathering_response = JSON.parse(get_claims_gathering_response);
                                    res.writeHead(301,
                                        {Location: objGet_claims_gathering_response.data.url}
                                    );
                                    res.end();
                                });
                            } else if(objGet_rpt_response.status == "error") {
                                console.log("error:"+get_rpt_response);
                            }
                        });
                    });
                });
            });
        });
    });
});

router.get('/claims_gathering_redirect', function(req, res) {
    console.log(req.query.ticket);
    console.log(req.query.state);
    jsonfile.readFile(setting, function(err, obj) {
        jsonfile.readFile(parameters, function(err, objRpConfig) {
            oxd.Request.op_host = objRpConfig.op_host;
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.Request.client_id = obj.client_id;
            oxd.Request.client_secret = obj.client_secret;
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = objRpConfig.httpBaseUrl+"/get-client-token";
            }
            oxd.Request.url = url;
            oxd.get_client_access_token(oxd.Request, function(access_token_response){
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;
                oxd.Request.ticket = req.query.ticket;
                oxd.Request.state = req.query.state;
                if(obj.conn_type == "local"){
                    var url = "";
                }else if(obj.conn_type == "web"){
                    var url = objRpConfig.httpBaseUrl+"/uma-rp-get-rpt";
                }
                oxd.uma_rp_get_rpt(oxd.Request, function(get_rpt_response){
                    var objGet_rpt_response = JSON.parse(get_rpt_response);
                    console.log(JSON.stringify(objGet_rpt_response));
                    var rptToken = objGet_rpt_response.data.access_token;
                    rptToken.replace(/\r?\n?/g, '');
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                    var body = "RPT="+rptToken;
                    var options = {
                        headers:{'content-type' : 'application/x-www-form-urlencoded'},
                        url:obj.protected_resource_url,
                        body: body,
                        json:true
                    };

                    httpRequest.post(options ,function (error, response, body) {
                        console.log(JSON.stringify(body));
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.write(JSON.stringify(body));
                        res.end();
                    });
                });
            });
        });
    });
});

router.get('/delete', function(req, res) {
    setTimeout(function(){
        jsonfile.readFile(setting, function(err, obj) {
            jsonfile.readFile(parameters, function(err, objRpConfig) {
                objRpConfig.op_host = "";
                objRpConfig.authorization_redirect_uri = "";
                objRpConfig.port = "8099";
                objRpConfig.httpBaseUrl = "";
                objRpConfig.post_logout_uri = "";
                obj.oxd_id = "";
                obj.conn_type = "local";
                obj.client_id="";
                obj.client_secret="";
                obj.client_name="";
                obj.message = "";
                obj.has_registration_endpoint = true;
                jsonfile.writeFile(parameters,objRpConfig,function(){
                    jsonfile.writeFile(setting,obj,function(){
                        res.writeHead(302, {
                            'Location': '/settings'
                        });
                        res.end();
                    });
                });
            });
        });
    });
});

router.post('/SetupClient', function(req, res){
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
    
    var gluu_scopes = scopes;

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
    oxd.Request.client_sector_identifier_uri = null;
    oxd.Request.ui_locales = null;
    oxd.Request.claims_locales = null;
    oxd.Request.grant_types = ["authorization_code","client_credentials"];
    oxd.Request.oxd_rp_programming_language = "node";
    oxd.Request.client_frontchannel_logout_uris = "";
    oxd.Request.claims_redirect_uri = [req.protocol+"://"+req.hostname+":"+properties.app_port+"/claims_gathering_redirect"];

    if (acr_value.length > 0)
        oxd.Request.acr_values = acr_value;

    var contacts = [];
    oxd.Request.contacts = contacts;
    if(req.body.conn_type == "local"){
        var url = "";
    }else if(req.body.conn_type == "web"){
        var url = req.body.oxd_web_value+"/setup-client";
    }
     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    httpRequest.get({url:req.body.op_host+'/.well-known/openid-configuration'} ,function (error, response, body) {
        console.log(error);
        var hasRegistrationEndPoint = true;
        if(!('registration_endpoint' in JSON.parse(body))){
            hasRegistrationEndPoint = false;
            jsonfile.readFile(setting, function(err, obj) {
                obj.has_registration_endpoint = hasRegistrationEndPoint;
                obj.client_name = req.body.client_name;
                jsonfile.writeFile(setting, obj, function(err) {
                    jsonfile.readFile(parameters, function(err,parametersData) {
                        parametersData.authorization_redirect_uri = req.body.redirect_uri;
                        parametersData.op_host = req.body.op_host;
                        parametersData.client_frontchannel_logout_uris = req.body.post_logout_uri;
                        parametersData.post_logout_uri = req.body.post_logout_uri;
                        parametersData.port = req.body.oxd_local_value;
                        parametersData.op_host = req.body.op_host;
                        parametersData.httpBaseUrl = req.body.oxd_web_value;
                        parametersData.scope = ["openid","profile","email"];
                        jsonfile.writeFile(parameters,parametersData, function(err) {
                            if(req.body.client_id == "" || req.body.client_secret == ""){
                                res.writeHead(302, {
                                    'Location': '/settings'
                                });
                                res.end();
                            }else{
                                obj.client_id = req.body.client_id;
                                obj.client_secret = req.body.client_secret;
                                obj.client_name = req.body.client_name;
                                jsonfile.writeFile(setting, obj, function(err) {
                                    if(obj.oxd_id == ""){
                                        oxd.Request.authorization_redirect_uri = req.body.redirect_uri;
                                        oxd.Request.op_host = req.body.op_host;
                                        oxd.Request.client_frontchannel_logout_uris = req.body.post_logout_uri;
                                        oxd.Request.post_logout_redirect_uri = req.body.post_logout_uri;
                                        oxd.Request.port = req.body.oxd_local_value;
                                        oxd.Request.client_id = req.body.client_id;
                                        oxd.Request.client_secret = req.body.client_secret;
                                        oxd.Request.client_name = req.body.client_name;
                                        oxd.Request.url = url;
                                        oxd.setup_client(oxd.Request, function(response) {
                                            var responsedata = JSON.parse(response);
                                            if (responsedata.status == "ok") {
                                                obj.oxd_id = responsedata.data.oxd_id;
                                                obj.conn_type = req.body.conn_type;
                                                obj.message = "Successfully Registered";
                                                jsonfile.writeFile(setting, obj, function(err) {
                                                    responsedata["redirectUrl"] = req.body.redirectUrl;
                                                    res.json(responsedata);
                                                });
                                            }else{
                                                obj.message = "Registration Failed";
                                                obj.conn_type = req.body.conn_type;
                                                jsonfile.writeFile(setting, obj, function(err) {
                                                    var data = {"error":responsedata.data.error}
                                                    res.json(data);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
        }else{
            jsonfile.readFile(setting, function(err, obj) {
                if(obj.oxd_id == ""){
                    oxd.Request.authorization_redirect_uri = req.body.redirect_uri;
                    oxd.Request.op_host = req.body.op_host;
                    oxd.Request.client_frontchannel_logout_uris = req.body.post_logout_uri;
                    oxd.Request.post_logout_redirect_uri = req.body.post_logout_uri;
                    oxd.Request.port = req.body.oxd_local_value;
                    oxd.Request.scopes = gluu_scopes;
                    oxd.Request.client_name = req.body.client_name;
                    oxd.Request.url = url;
                    oxd.setup_client(oxd.Request, function(response) {
                        console.log(response);
                        var responsedata = JSON.parse(response);
                        if (responsedata.status == "ok") {
                            obj.oxd_id = responsedata.data.oxd_id;
                            obj.client_id = responsedata.data.client_id;
                            obj.client_secret = responsedata.data.client_secret;
                            obj.conn_type = req.body.conn_type;
                            obj.client_name = req.body.client_name;
                            obj.message = "Successfully Registered";
                            jsonfile.writeFile(setting, obj, function(err) {
                                jsonfile.readFile(parameters, function(err,parametersData) {
                                    parametersData.authorization_redirect_uri = req.body.redirect_uri;
                                    parametersData.op_host = req.body.op_host;
                                    parametersData.client_frontchannel_logout_uris = req.body.post_logout_uri;
                                    parametersData.post_logout_uri = req.body.post_logout_uri;
                                    parametersData.port = req.body.oxd_local_value;
                                    parametersData.op_host = req.body.op_host;
                                    parametersData.httpBaseUrl = req.body.oxd_web_value;
                                    parametersData.scopes = gluu_scopes;
                                    jsonfile.writeFile(parameters,parametersData, function(err) {
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
        }
        
    });
});

router.post('/Update', function(req, res){
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                oxd.Request.authorization_redirect_uri = req.body.redirect_uri;
                oxd.Request.op_host = req.body.op_host;
                oxd.Request.client_frontchannel_logout_uris = req.body.post_logout_uri;
                oxd.Request.post_logout_redirect_uri = req.body.post_logout_uri;
                oxd.Request.port = req.body.oxd_local_value;
                oxd.Request.oxd_id = obj.oxd_id;
                oxd.Request.client_name = req.body.client_name;
                parametersData.authorization_redirect_uri = req.body.redirect_uri;
                parametersData.op_host = req.body.op_host;
                parametersData.client_frontchannel_logout_uris = req.body.post_logout_uri;
                parametersData.post_logout_uri = req.body.post_logout_uri;
                parametersData.port = req.body.oxd_local_value;
                parametersData.op_host = req.body.op_host;
                parametersData.httpBaseUrl = req.body.oxd_web_value;
                if(req.body.conn_type == "web"){
                    obj.conn_type = "web";
                }else{
                    obj.conn_type = "local";
                }
                obj.message = "Successfully Updated";
                console.log(parametersData);
                jsonfile.writeFile(parameters,parametersData,function(err){
                    jsonfile.writeFile(setting,obj,function(err){
                        if(obj.has_registration_endpoint){
                            oxd.Request.client_id = obj.client_id;
                            oxd.Request.client_secret = obj.client_secret;
                            if(req.body.conn_type == "local"){
                                var url = "";
                            }else if(req.body.conn_type == "web"){
                                var url = req.body.oxd_web_value+"/get-client-token";
                            }
                            oxd.Request.url = url;
                            oxd.get_client_access_token(oxd.Request, function(access_token_response){
                                var access_token_data = JSON.parse(access_token_response);
                                oxd.Request.protection_access_token = access_token_data.data.access_token;

                                if(req.body.conn_type == "local"){
                                    var url = "";
                                }else if(req.body.conn_type == "web"){
                                    var url = req.body.oxd_web_value+"/update-site";
                                }
                                oxd.Request.url = url;
                                oxd.update_site_registration(oxd.Request, function(response) {
                                    res.json(response); 
                                });

                            });
                        }else{
                            res.json('{"status":"ok"}');
                        }
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

router.get('/Authorization', function(req, res){
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                parametersData.post_logout_redirect_uri = req.body.postLogoutRedirectUrl;
                oxd.Request.oxd_id = obj.oxd_id; 
                oxd.Request.op_host = parametersData.op_host;
                oxd.Request.scope=["openid","profile","email","uma_protection","uma_authorization"];
                jsonfile.writeFile(parameters,parametersData,function(err){
                    if(obj.has_registration_endpoint){
                        if(obj.conn_type == "local"){
                            var url = "";
                        }else if(obj.conn_type == "web"){
                            var url = parametersData.httpBaseUrl+"/get-client-token";
                        }
                        oxd.Request.url = url;
                        oxd.Request.client_id = obj.client_id;
                        oxd.Request.client_secret = obj.client_secret;
                        oxd.get_client_access_token(oxd.Request, function(access_token_response){
                            var access_token_data = JSON.parse(access_token_response);
                            oxd.Request.protection_access_token = access_token_data.data.access_token;
                            if(obj.conn_type == "local"){
                                var url = "";
                            }else if(obj.conn_type == "web"){
                                var url = parametersData.httpBaseUrl+"/get-authorization-url";
                            }
                            oxd.Request.url = url;
                            oxd.Request.custom_parameters = {
                                param1 : "value1",
                                param2 : "value2"
                            };
                            oxd.get_authorization_url(oxd.Request, function(response) {
                                response = JSON.parse(response);
                                console.log(response.data.authorization_url);
                                console.log(res.redirect(response.data.authorization_url));
                            });
                        });
                    }else{
                        oxd.Request.scope=["openid","profile","email"];
                        if(obj.conn_type == "local"){
                            var url = "";
                        }else if(obj.conn_type == "web"){
                            var url = parametersData.httpBaseUrl+"/get-authorization-url";
                        }
                        oxd.Request.url = url;
                        oxd.get_authorization_url(oxd.Request, function(response) {
                            response = JSON.parse(response);
                            console.log(response.data.authorization_url);
                            res.redirect(response.data.authorization_url);
                        });
                    }
                });
            });            
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.get('/Login', function(req, res){
    res.render('login');
});

router.get('/Login_redirect', function(req, res){
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    jsonfile.readFile(setting, function(err, obj) {
        if(obj.oxd_id != ""){
            jsonfile.readFile(parameters, function(err, parametersData){
                parametersData.code = oxd.Request.code = url_parts.query.code;
                parametersData.state = oxd.Request.state = url_parts.query.state;
                oxd.Request.oxd_id = obj.oxd_id; 
                oxd.Request.op_host = parametersData.op_host;
                oxd.Request.scope=["openid","profile","email","uma_protection","uma_authorization"];
                jsonfile.writeFile(parameters,parametersData,function(err){
                    if(obj.has_registration_endpoint){
                        oxd.Request.client_id = obj.client_id;
                        oxd.Request.client_secret = obj.client_secret;
                        if(obj.conn_type == "local"){
                            var url = "";
                        }else if(obj.conn_type == "web"){
                            var url = parametersData.httpBaseUrl+"/get-client-token";
                        }
                        oxd.Request.url = url;
                        oxd.get_client_access_token(oxd.Request, function(access_token_response){
                            var access_token_data = JSON.parse(access_token_response);
                            oxd.Request.protection_access_token = access_token_data.data.access_token;
                            if(obj.conn_type == "local"){
                                var url = "";
                            }else if(obj.conn_type == "web"){
                                var url = parametersData.httpBaseUrl+"/get-tokens-by-code";
                            }
                            oxd.Request.url = url;
                            oxd.get_tokens_by_code(oxd.Request, function(response) {
                                response = JSON.parse(response);
                                console.log(response);
                                var refresh_token = response.data.refresh_token;
                                jsonfile.readFile(setting, function(err, obj) {
                                    if(obj.oxd_id != ""){
                                        oxd.Request.oxd_id = obj.oxd_id;
                                        oxd.Request.client_id = obj.client_id;
                                        oxd.Request.client_secret = obj.client_secret;
                                        if(obj.conn_type == "local"){
                                            var url = "";
                                        }else if(obj.conn_type == "web"){
                                            var url = parametersData.httpBaseUrl+"/get-client-token";
                                        }
                                        oxd.Request.url = url;
                                        oxd.get_client_access_token(oxd.Request, function(access_token_response){
                                            var access_token_data = JSON.parse(access_token_response);
                                            oxd.Request.protection_access_token = access_token_data.data.access_token;
                                            oxd.Request.refresh_token = refresh_token;
                                            oxd.Request.oxd_id = obj.oxd_id;
                                            if(obj.conn_type == "local"){
                                                var url = "";
                                            }else if(obj.conn_type == "web"){
                                                var url = parametersData.httpBaseUrl+"/get-access-token-by-refresh-token";
                                            }
                                            oxd.Request.url = url;
                                            oxd.get_access_token_by_refresh_token(oxd.Request, function(access_token){
                                                oxd.Request.oxd_id = obj.oxd_id;
                                                var access_token_data = JSON.parse(access_token);
                                                oxd.Request.access_token = access_token_data.data.access_token;
                                                if(obj.conn_type == "local"){
                                                    var url = "";
                                                }else if(obj.conn_type == "web"){
                                                    var url = parametersData.httpBaseUrl+"/get-user-info";
                                                }
                                                oxd.Request.url = url;
                                                oxd.get_user_info(oxd.Request, function(response) {
                                                    console.log(response);
                                                    response = JSON.parse(response);
                                                    var data = {};
                                                    data['userName'] = response.data.claims.name[0];
                                                    data['userEmail'] = response.data.claims.email[0];
                                                    res.render('login_redirect',{data:data});
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
                        });
                    }else{
                        if(obj.conn_type == "local"){
                            var url = "";
                        }else if(obj.conn_type == "web"){
                            var url = parametersData.httpBaseUrl+"/get-tokens-by-code";
                        }
                        oxd.Request.scope=["openid","profile","email"];
                        oxd.Request.url = url;
                        oxd.get_tokens_by_code(oxd.Request, function(response) {
                            response = JSON.parse(response);
                            oxd.Request.oxd_id = obj.oxd_id;
                            oxd.Request.access_token = response.data.access_token;
                            if(obj.conn_type == "local"){
                                var url = "";
                            }else if(obj.conn_type == "web"){
                                var url = parametersData.httpBaseUrl+"/get-user-info";
                            }
                            oxd.get_user_info(oxd.Request, function(response) {
                                console.log(response);
                                response = JSON.parse(response);
                                var data = {};
                                data['userName'] = response.data.claims.name[0];
                                data['userEmail'] = response.data.claims.email[0];
                                res.render('login_redirect',{data:data});
                            });    
                        });
                    }
                });
            });            
            
        }
        else{
            var data = {"error":"please register first."};
            res.json(data);
        }
    });
});

router.get('/uma', function(req, res) {
    res.render('uma');
});

router.get('/protect', function(req, res) {
    console.log(req.subdomains);
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.client_id = obj.client_id;
        oxd.Request.client_secret = obj.client_secret;
        jsonfile.readFile(parameters, function(err, parametersData) {
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = parametersData.httpBaseUrl+"/get-client-token";
            }
            oxd.Request.op_host = parametersData.op_host;
            oxd.Request.url = url;
            oxd.get_client_access_token(oxd.Request, function(access_token_response){
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;
                oxd.Request.oxd_id = obj.oxd_id;
                var resources = [
                    {
                        path: "/photo",
                        conditions: [
                            {
                                httpMethods:["GET","POST"],
                                scopes:["https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1"],
                                ticketScopes:["https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1"]
                            }
                        ]
                    }
                ];
                oxd.Request.resources = resources;
                if(obj.conn_type == "local"){
                    var url = "";
                }else if(obj.conn_type == "web"){
                    var url = parametersData.httpBaseUrl+"/uma-rs-protect";
                }
                oxd.Request.url = url;
                oxd.uma_rs_protect(oxd.Request, function(response) {
                    res.render('uma_response',{data:response});
                });    
            });
        });
    });
});

router.get('/check_access', function(req, res) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.client_id = obj.client_id;
        oxd.Request.client_secret = obj.client_secret;
        jsonfile.readFile(parameters, function(err, parametersData) {
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = parametersData.httpBaseUrl+"/get-client-token";
            }
            oxd.Request.url = url;
            oxd.Request.op_host = parametersData.op_host;
            oxd.get_client_access_token(oxd.Request, function(access_token_response){
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;
                oxd.Request.oxd_id = obj.oxd_id;
                    if(obj.conn_type == "local"){
                        var url = "";
                    }else if(obj.conn_type == "web"){
                        var url = parametersData.httpBaseUrl+"/uma-rs-check-access";
                    }
                    oxd.Request.url = url;
                    oxd.Request.rpt = "";
                    oxd.Request.http_method = "GET";
                    oxd.Request.path = "/photo";
                    oxd.uma_rs_check_access(oxd.Request, function(response) {
                        res.render('uma_response',{data:response});
                    }); 
            });
        });
        
    });
});

router.get('/get_rpt', function(req, res) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.client_id = obj.client_id;
        oxd.Request.client_secret = obj.client_secret;
        jsonfile.readFile(parameters, function(err, parametersData) {
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = parametersData.httpBaseUrl+"/get-client-token";
            }
            oxd.Request.url = url;
            oxd.Request.op_host = parametersData.op_host;
            oxd.get_client_access_token(oxd.Request, function(access_token_response){
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;
                oxd.Request.oxd_id = obj.oxd_id;
                if(obj.conn_type == "local"){
                    var url = "";
                }else if(obj.conn_type == "web"){
                    var url = parametersData.httpBaseUrl+"/uma-rp-get-rpt";
                }
                oxd.Request.url = url;
                oxd.Request.ticket = "09f32169-de52-42fe-9796-59ba21637a64";
                oxd.uma_rp_get_rpt(oxd.Request, function(response) {
                    res.render('uma_response',{data:response});
                });    
            });
        });
    });
});

router.get('/claims_gathering_url', function(req, res) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.client_id = obj.client_id;
        oxd.Request.client_secret = obj.client_secret;
        jsonfile.readFile(parameters, function (err, parametersData) {
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = parametersData.httpBaseUrl+"/get-client-token";
            }
            oxd.Request.op_host = parametersData.op_host;
            oxd.Request.url = url;
            oxd.get_client_access_token(oxd.Request, function (access_token_response) {
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;
                oxd.Request.oxd_id = obj.oxd_id;
                if (obj.conn_type == "local") {
                    var url = "";
                } else if (obj.conn_type == "web") {
                    var url = parametersData.httpBaseUrl + "/uma-rp-get-claims-gathering-url";
                }
                oxd.Request.ticket = "09f32169-de52-42fe-9796-59ba21637a64";
                oxd.Request.claims_redirect_uri = "https://node.oxdexample.com:5053/settings";
                oxd.Request.url = url;
                console.log(oxd.Request);
                oxd.uma_rp_get_claims_gathering_url(oxd.Request, function (response) {
                    res.render('uma_response', {data: response});
                });
            });
        });
    });
});

router.post('/GetLogoutUri', function(req, res){
    jsonfile.readFile(setting, function(err, obj) {
        jsonfile.readFile(parameters, function (err, parametersData) {
        if(obj.has_registration_endpoint){
            if(obj.oxd_id != ""){
                oxd.Request.oxd_id = obj.oxd_id;
                oxd.Request.client_id = obj.client_id;
                oxd.Request.client_secret = obj.client_secret;
                oxd.Request.op_host = parametersData.op_host;
                if(obj.conn_type == "local"){
                    var url = "";
                }else if(obj.conn_type == "web"){
                    var url = parametersData.httpBaseUrl+"/get-client-token";
                }
                oxd.Request.url = url;
                oxd.get_client_access_token(oxd.Request, function(access_token_response){
                    var access_token_data = JSON.parse(access_token_response);
                    console.log("access_token_response");
                    console.log(access_token_response);
                    oxd.Request.protection_access_token = access_token_data.data.access_token;
                    oxd.Request.state = null;
                    if(obj.conn_type == "local"){
                        var url = "";
                    }else if(obj.conn_type == "web"){
                        var url = parametersData.httpBaseUrl+"/get-logout-uri";
                    }
                    oxd.Request.url = url;
                    oxd.get_logout_uri(oxd.Request, function(response) {
                        console.log(response);
                        response = JSON.parse(response);
                        var data = {};
                        data['logoutUri'] = response.data.uri;
                        console.log("response");
                        console.log(data);
                        res.json(data);
                    });          
                }); 
            }else{
                var data = {"error":"please register first."};
                res.json(data);
            }
        }else{
            oxd.Request.oxd_id = obj.oxd_id; 
            oxd.Request.op_host = parametersData.op_host;
            if(obj.conn_type == "local"){
                var url = "";
            }else if(obj.conn_type == "web"){
                var url = parametersData.httpBaseUrl+"/get-logout-uri";
            }
            oxd.Request.url = url;
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
        });
    });
});


module.exports = router;
