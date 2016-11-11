var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '/../settings.json');
var data = path.join(__dirname, '/../data.json');
var loginstatus = path.join(__dirname, '/../loginstatus.json');
var acrgroup = path.join(__dirname, '/../acr.json');
var oxd = require("oxd-node");
var properties = require('../properties');
var url = require('url');
var properties = require('../properties');

router.get('/', function(req, res) {
    if (req.query.code != null) {
        jsonfile.readFile(setting, function(err, obj) {
            res.cookie('ss', req.query.session_state, {
                maxAge: 900000,
                httpOnly: false
            });
            oxd.Request.oxd_id = obj.oxd_id;
            oxd.Request.code = req.query.code;
            oxd.Request.state = req.query.state;
            oxd.Request.nonce = req.query.nonce;
            oxd.get_tokens_by_code(oxd.Request, function(response) {
                var jsondata = JSON.parse(response);
                var mysession = req.session;
                mysession.access_token = jsondata.data.access_token;
                if (jsondata.data.access_token != null && jsondata.status == "ok") {
                    res.redirect("get_user_info");
                } else {
                    res.redirect("authenticate");
                }
            });
        });
    } else {
        res.redirect("authenticate");
    }
});

router.get('/authenticate', function(req, res, next) {
    var acr_basic = "none";
    var acr_gplus = "none";
    var acr_duo = "none";
    var acr_u2f = "none";
    var acr_connect = "none";
    var auth_logout = "none";

    jsonfile.readFile(loginstatus, function(err, obj) {
        var result = isEmpty(obj);
        if (result == false) {
            if (obj.login == "true") {
                auth_logout = "block";
            }
        }
    });

    jsonfile.readFile(acrgroup, function(err, obj) {
        var acrresult = isEmpty(obj);
        if (acrresult == false) {
            if (obj.basic != undefined) {
                acr_basic = "block";
                acr_connect = "block";
            }

            if (obj.gplus != undefined) {
                acr_gplus = "block";
                acr_connect = "block";
            }

            if (obj.duo != undefined) {
                acr_duo = "block";
                acr_connect = "block";
            }

            if (obj.u2f != undefined) {
                acr_u2f = "block";
                acr_connect = "block";
            }
        }
    })
    jsonfile.readFile(setting, function(err, objoxd) {

        if (objoxd.oxd_id == null || objoxd.oxd_id == "")
            res.render('home.ejs', {
                errorName: "",
                errorMessage: "",
                errorVisibility: "none"
            });
        else
            jsonfile.readFile(data, function(err, obj) {

                var result = isEmpty(obj);
                if (result == true)
                    res.render('success.ejs', {
                        oxd_id: objoxd.oxd_id,
                        display_user_data: 'none',
                        name: 'NA',
                        email: 'NA',
                        gender: 'NA',
                        birthdate: 'NA',
                        profile: 'NA',
                        website: 'NA',
                        zoneinfo: 'NA',
                        acr_basic: acr_basic,
                        acr_gplus: acr_gplus,
                        acr_duo: acr_duo,
                        acr_u2f: acr_u2f,
                        acr_connect: acr_connect,
                        auth_logout: auth_logout
                    });
                else {
                    var email = "NA";
                    var name = "NA";
                    var gender = "NA";
                    var birthdate = "NA";
                    var profile = "NA";
                    var website = "NA";
                    var zoneinfo = "NA";

                    if (obj.email != undefined) {
                        email = obj.email;
                    }

                    if (obj.name != undefined) {
                        name = obj.name;
                    }

                    if (obj.gender != undefined) {
                        gender = obj.gender;
                    }

                    if (obj.birthdate != undefined) {
                        birthdate = obj.birthdate;
                    }

                    if (obj.profile != undefined) {
                        profile = obj.profile;
                    }

                    if (obj.website != undefined) {
                        website = obj.website;
                    }


                    if (obj.zoneinfo != undefined) {
                        zoneinfo = obj.zoneinfo;
                    }

                    res.render('success.ejs', {
                        oxd_id: objoxd.oxd_id,
                        display_user_data: 'block',
                        name: name,
                        email: email,
                        gender: gender,
                        birthdate: birthdate,
                        profile: profile,
                        website: website,
                        zoneinfo: zoneinfo,
                        acr_basic: acr_basic,
                        acr_gplus: acr_gplus,
                        acr_duo: acr_duo,
                        acr_u2f: acr_u2f,
                        acr_connect: acr_connect,
                        auth_logout: auth_logout
                    });
                }

            });
    });
});
router.post('/register_site', function(req, res, next) {
    if (!req.secure) {
        res.send(400, {
            error: "This connection is untrusted, your host should be with https"
        });
        return;
    }
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

    oxd.Request.authorization_redirect_uri = "https://" + req.get('host');
    oxd.Request.post_logout_redirect_uri = "https://" + req.get('host');
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
                    res.redirect("authenticate");
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
            oxd.Request.scope = scopes;
            oxd.update_site_registration(oxd.Request, function(response) {
                var responsedata = JSON.parse(response);
                if (responsedata.status == "ok") {
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function(err) {});
                    res.redirect("authenticate");
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
                res.status(200).send(response);
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
                            jsonfile.writeFile(data, jsondata.data.claims);
                            jsonfile.writeFile(loginstatus, {
                                login: "true"
                            });

                            res.redirect("authenticate");
                        } else {
                            res.redirect("authenticate");
                        }
                    } else {
                        res.redirect("authenticate");
                    }
                }
            });
        } else {
            res.redirect("authenticate");
        }
    });

});

router.get('/logoutadmin', function(req, res, next) {
    res.render('login.ejs', {
        title: "Login",
        errorName: "",
        errorMessage: "",
        errorVisibility: "none"
    });
});
router.post('/logoutuser', function(req, res, next) {
    jsonfile.readFile(setting, function(err, obj) {
        oxd.Request.oxd_id = obj.oxd_id;
        var cookies = parseCookies(req);
        oxd.Request.post_logout_redirect_uri = "https://" + req.get('host');
        oxd.Request.session_state = cookies.ss;
        oxd.Request.state = cookies.state;
        oxd.get_logout_uri(oxd.Request, function(response) {
            if (response.length > 0) {
                jsonfile.writeFile(loginstatus, {
                    login: "false"
                });
                res.status(200).send(response);
                return;
            }
        });
    });
});
/*router.get('/logout', function(req, res, next) {
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
});*/

router.get('/callrp', function(req, res, next) {
    res.render('rpframe.ejs');
});

router.get('/callop', function(req, res, next) {
    res.render('opframe.ejs');
});

router.post('/fullumatest', function(req, res, next) {

    // Protect Resources
    jsonfile.readFile(setting, function(err, obj) {

        var requestuma_rs_protect = {};
        requestuma_rs_protect = {
            "resources": [{
                "path": "/scim",
                "conditions": [{
                    "httpMethods": ["GET"],
                    "scopes": ["https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1"],
                    "ticketScopes": ["https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1"]
                }]
            }]
        };

        requestuma_rs_protect.oxd_id = obj.oxd_id;
        oxd.uma_rs_protect(requestuma_rs_protect, function(data) {
            if (data.length > 0) {

                //2. Check Access with empty RPT. Expect access denied and a valid ticket    
                var checkresourceRequest = {};
                checkresourceRequest.oxd_id = obj.oxd_id;
                checkresourceRequest.rpt = "";
                checkresourceRequest.http_method = "GET";
                checkresourceRequest.path = "/scim";

                oxd.uma_rs_check_access(checkresourceRequest, function(response) {

                    console.log(response);

                    var jsondata = JSON.parse(response);

                    if (jsondata.status == "ok") {
                        if (jsondata.data.access.toLowerCase() == "denied") {
                            if (jsondata.data.ticket == null) {
                                console.log("Expected valid ticket as part of check access. But Null or Empty returned.");
                            } else {

                                //3. Obtain RPT. Expect a valid RPT is returned.
                                var checkRptRequest = {};
                                checkRptRequest.oxd_id = obj.oxd_id;
                                oxd.uma_rp_get_rpt(checkRptRequest, function(rptResponse) {

                                    var rptJsonData = JSON.parse(rptResponse);

                                    if (rptJsonData.status == "ok") {
                                        if (rptJsonData.data.rpt == null) {
                                            console.log("Tryting to obtain RPT. But Null or Empty returned.");
                                            res.status(500).send({ error: 'Tryting to obtain RPT. But Null or Empty returned.' })
                                        } else {

                                            //4. Check Access again with valid RPT. Still the access should be granted. Expect access denied    
                                            var checkValidRptRequest = {};
                                            checkValidRptRequest.oxd_id = obj.oxd_id;
                                            checkValidRptRequest.rpt = rptJsonData.data.rpt;
                                            checkValidRptRequest.http_method = "GET";
                                            checkValidRptRequest.path = "/scim";

                                            oxd.uma_rs_check_access(checkValidRptRequest, function(validRptResponse) {

                                                var validRptJsonData = JSON.parse(validRptResponse);

                                                if (validRptJsonData.status == "ok") {
                                                    if (validRptJsonData.data.access.toLowerCase() == "denied") {

                                                        //5. Authorize RPT. Expect status should be ok    
                                                        var authorizeRpt = {};
                                                        authorizeRpt.oxd_id = obj.oxd_id;
                                                        authorizeRpt.rpt = rptJsonData.data.rpt;
                                                        authorizeRpt.ticket = validRptJsonData.data.ticket;

                                                        oxd.uma_rp_authorize_rpt(authorizeRpt, function(authorizeRptResponse) {
                                                            var authorizeRptResponseJsonData = JSON.parse(authorizeRptResponse);
                                                            if (authorizeRptResponseJsonData.status == "ok") {
                                                                
                                                                //6. Authorized RPT. Check Access again. Expect access granted.    
                                                                var checkValidRptGrantedRequest = {};
                                                                checkValidRptGrantedRequest.oxd_id = obj.oxd_id;
                                                                checkValidRptGrantedRequest.rpt = rptJsonData.data.rpt;
                                                                checkValidRptGrantedRequest.http_method = "GET";
                                                                checkValidRptGrantedRequest.path = "/scim";

                                                                oxd.uma_rs_check_access(checkValidRptGrantedRequest, function(validRptGrantedResponse) {
                                                                    var validRptGrantedResponseJsonData = JSON.parse(validRptGrantedResponse);

                                                                    if(validRptGrantedResponseJsonData.status == "ok")
                                                                    {
                                                                            if (validRptGrantedResponseJsonData.data.access.toLowerCase() == "granted") {
                                                                                console.log("Test successfully done");
                                                                                res.status(200).send({ success: 'Test successfully done' })

                                                                            }
                                                                            else{
                                                                                console.log("Test Failure");
                                                                                res.status(500).send({ error: 'Tryting to obtain RPT. But Null or Empty returned.' })
                                                                            }
                                                                    }

                                                                    console.log(validRptGrantedResponse);
                                                                });

                                                            } else {
                                                                console.log("Error : " + authorizeRptResponse);
                                                                res.status(500).send({ error: authorizeRptResponse })
                                                            }

                                                        });


                                                    } else {
                                                        console.log("Access Denied expected. But something else is coming." + validRptResponse);
                                                        res.status(500).send({ error: 'Access Denied expected. But something else is coming.' })
                                                    }

                                                }

                                            });
                                        }
                                    } else {
                                        console.log("Error : " + rptResponse);
                                        res.status(500).send({ error: rptResponse })
                                    }

                                });
                            }
                        } else {
                            console.log("Access Denied expected. But something else is coming = " + response);
                            res.status(500).send({ error: 'Access Denied expected. But something else is coming' });
                        }

                    } else {
                        console.log("Error : " + response);
                        res.status(500).send({ error: response });
                    }




                    // res.status(200).json(response);
                });
            }

        });

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

function isEmpty(obj) {
    for (var prop in obj) {
        return false;
    }
    return true;
}

module.exports = router;
