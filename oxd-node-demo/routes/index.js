var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var path = require('path');

const config = {};

var oxd = require('oxd-node')(config);

var setting = path.join(__dirname, '/../settings.json');
var parameters = path.join(__dirname, '/../parameters.json');
var data = path.join(__dirname, '/../data.json');
var loginstatus = path.join(__dirname, '/../loginstatus.json');
var acrgroup = path.join(__dirname, '/../acr.json');

router.get('/', function (req, res) {
  jsonfile.readFile(setting, function (err, oSetting) {
    jsonfile.readFile(parameters, function (err, oRpConfig) {
      if (oSetting.oxd_id) {
        res.redirect('/login');
      } else {
        res.redirect('/settings');
      }
    });
  });
});

router.get('/settings', function (req, res) {
  jsonfile.readFile(setting, function (err, oSetting) {
    jsonfile.readFile(parameters, function (err, oRpConfig) {
      res.render('settings', {oxdObject: oSetting, oxdRpConfig: oRpConfig});
    });
  });
});

router.get('/delete', function (req, res) {
  setTimeout(function () {
    jsonfile.readFile(setting, function (err, obj) {
      jsonfile.readFile(parameters, function (err, objRpConfig) {
        objRpConfig.op_host = '';
        objRpConfig.authorization_redirect_uri = '';
        objRpConfig.port = '8099';
        objRpConfig.httpBaseUrl = '';
        objRpConfig.post_logout_uri = '';
        obj.oxd_id = '';
        obj.conn_type = 'local';
        obj.client_id = '';
        obj.client_secret = '';
        obj.client_name = '';
        obj.message = '';
        obj.has_registration_endpoint = true;
        jsonfile.writeFile(parameters, objRpConfig, function () {
          jsonfile.writeFile(setting, obj, function () {
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

router.post('/register', function (req, res) {
  var scopes = ['openid', 'profile', 'email', 'uma_protection'];
  var oxdRequest = {
    scope: scopes,
    grant_types: ['authorization_code'],
    authorization_redirect_uri: req.body.redirect_uri
  };

  //Define acr_values
  var acr_value = [];
  var acr_value_array = {};
  var acr_basic = 'none';
  var acr_gplus = 'none';
  var acr_duo = 'none';
  var acr_u2f = 'none';
  var acr_connect = 'none';

  if (req.body.oxd_openid_gplus_enable == 1) {
    acr_value.push('gplus');
    acr_value_array.gplus = 'gplus';
    acr_connect = 'block';
    acr_gplus = 'block';
  }
  if (req.body.oxd_openid_basic_enable == 1) {
    acr_value.push('basic');
    acr_value_array.basic = 'basic';
    acr_connect = 'block';
    acr_basic = 'block';
  }
  if (req.body.oxd_openid_duo_enable == 1) {
    acr_value.push('duo');
    acr_value_array.duo = 'duo';
    acr_connect = 'block';
    acr_duo = 'block';
  }
  if (req.body.oxd_openid_u2f_enable == 1) {
    acr_value.push('u2f');
    acr_value_array.u2f = 'u2f';
    acr_connect = 'block';
    acr_u2f = 'block';
  }

  jsonfile.writeFile(acrgroup, acr_value_array, function (err) {
  });

  jsonfile.writeFile(loginstatus, {login: false});

  if (acr_value.length > 0)
    oxdRequest.acr_values = acr_value;

  if (req.body.conn_type == 'local') {
    oxdRequest.https_extension = false;
    oxdRequest.host = 'localhost';
    oxdRequest.port = '8099';
  } else if (req.body.conn_type == 'web') {
    oxdRequest.https_extension = true;
    oxdRequest.host = 'http://localhost:8553';
  }

  oxd.setup_client(oxdRequest, function (response) {
    console.log(response);
    if (response.status == 'ok') {
      response.data.https_extension = req.body.https_extension;
      response.data.message = 'Successfully Registered';
      jsonfile.writeFile(setting, response.data, function (err) {
        jsonfile.readFile(parameters, function (err, parametersData) {
          parametersData.authorization_redirect_uri = req.body.redirect_uri;
          parametersData.op_host = req.body.op_host;
          parametersData.client_frontchannel_logout_uris = req.body.post_logout_uri;
          parametersData.post_logout_uri = req.body.post_logout_uri;
          parametersData.port = req.body.oxd_local_value;
          parametersData.op_host = req.body.op_host;
          parametersData.httpBaseUrl = req.body.oxd_web_value;
          parametersData.scopes = scopes;
          jsonfile.writeFile(parameters, parametersData, function (err) {
            res.json(req.body.redirect_uri);
          });
        });
      });
    }
  });
});
router.post('/Update', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    if (obj.oxd_id != '') {
      jsonfile.readFile(parameters, function (err, parametersData) {
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
        if (req.body.conn_type == 'web') {
          obj.conn_type = 'web';
        } else {
          obj.conn_type = 'local';
        }
        obj.message = 'Successfully Updated';
        console.log(parametersData);
        jsonfile.writeFile(parameters, parametersData, function (err) {
          jsonfile.writeFile(setting, obj, function (err) {
            if (obj.has_registration_endpoint) {
              oxd.Request.client_id = obj.client_id;
              oxd.Request.client_secret = obj.client_secret;
              if (req.body.conn_type == 'local') {
                var url = '';
              } else if (req.body.conn_type == 'web') {
                var url = req.body.oxd_web_value + '/get-client-token';
              }
              oxd.Request.url = url;
              oxd.get_client_access_token(oxd.Request, function (access_token_response) {
                var access_token_data = JSON.parse(access_token_response);
                oxd.Request.protection_access_token = access_token_data.data.access_token;

                if (req.body.conn_type == 'local') {
                  var url = '';
                } else if (req.body.conn_type == 'web') {
                  var url = req.body.oxd_web_value + '/update-site';
                }
                oxd.Request.url = url;
                oxd.update_site_registration(oxd.Request, function (response) {
                  res.json(response);
                });

              });
            } else {
              res.json({status: 'ok'});
            }
          });
        });
      });

    }
    else {
      var data = {'error': 'please register first.'};
      res.json(data);
    }
  });
});

router.get('/Authorization', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    if (obj.oxd_id != '') {
      jsonfile.readFile(parameters, function (err, parametersData) {
        parametersData.post_logout_redirect_uri = req.body.postLogoutRedirectUrl;
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.op_host = parametersData.op_host;
        oxd.Request.scope = ['openid', 'profile', 'email', 'uma_protection', 'uma_authorization'];
        jsonfile.writeFile(parameters, parametersData, function (err) {
          if (obj.has_registration_endpoint) {
            if (obj.conn_type == 'local') {
              var url = '';
            } else if (obj.conn_type == 'web') {
              var url = parametersData.httpBaseUrl + '/get-client-token';
            }
            oxd.Request.url = url;
            oxd.Request.client_id = obj.client_id;
            oxd.Request.client_secret = obj.client_secret;
            oxd.get_client_access_token(oxd.Request, function (access_token_response) {
              var access_token_data = JSON.parse(access_token_response);
              oxd.Request.protection_access_token = access_token_data.data.access_token;
              if (obj.conn_type == 'local') {
                var url = '';
              } else if (obj.conn_type == 'web') {
                var url = parametersData.httpBaseUrl + '/get-authorization-url';
              }
              oxd.Request.url = url;
              oxd.Request.custom_parameters = {
                param1: 'value1',
                param2: 'value2'
              };
              oxd.get_authorization_url(oxd.Request, function (response) {
                response = JSON.parse(response);
                console.log(response.data.authorization_url);
                console.log(res.redirect(response.data.authorization_url));
              });
            });
          } else {
            oxd.Request.scope = ['openid', 'profile', 'email'];
            if (obj.conn_type == 'local') {
              var url = '';
            } else if (obj.conn_type == 'web') {
              var url = parametersData.httpBaseUrl + '/get-authorization-url';
            }
            oxd.Request.url = url;
            oxd.get_authorization_url(oxd.Request, function (response) {
              response = JSON.parse(response);
              console.log(response.data.authorization_url);
              res.redirect(response.data.authorization_url);
            });
          }
        });
      });

    }
    else {
      var data = {'error': 'please register first.'};
      res.json(data);
    }
  });
});

router.get('/Login', function (req, res) {
  res.render('login');
});

router.get('/Login_redirect', function (req, res) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  jsonfile.readFile(setting, function (err, obj) {
    if (obj.oxd_id != '') {
      jsonfile.readFile(parameters, function (err, parametersData) {
        parametersData.code = oxd.Request.code = url_parts.query.code;
        parametersData.state = oxd.Request.state = url_parts.query.state;
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.op_host = parametersData.op_host;
        oxd.Request.scope = ['openid', 'profile', 'email', 'uma_protection', 'uma_authorization'];
        jsonfile.writeFile(parameters, parametersData, function (err) {
          if (obj.has_registration_endpoint) {
            oxd.Request.client_id = obj.client_id;
            oxd.Request.client_secret = obj.client_secret;
            if (obj.conn_type == 'local') {
              var url = '';
            } else if (obj.conn_type == 'web') {
              var url = parametersData.httpBaseUrl + '/get-client-token';
            }
            oxd.Request.url = url;
            oxd.get_client_access_token(oxd.Request, function (access_token_response) {
              var access_token_data = JSON.parse(access_token_response);
              oxd.Request.protection_access_token = access_token_data.data.access_token;
              if (obj.conn_type == 'local') {
                var url = '';
              } else if (obj.conn_type == 'web') {
                var url = parametersData.httpBaseUrl + '/get-tokens-by-code';
              }
              oxd.Request.url = url;
              oxd.get_tokens_by_code(oxd.Request, function (response) {
                response = JSON.parse(response);
                console.log(response);
                var refresh_token = response.data.refresh_token;
                jsonfile.readFile(setting, function (err, obj) {
                  if (obj.oxd_id != '') {
                    oxd.Request.oxd_id = obj.oxd_id;
                    oxd.Request.client_id = obj.client_id;
                    oxd.Request.client_secret = obj.client_secret;
                    if (obj.conn_type == 'local') {
                      var url = '';
                    } else if (obj.conn_type == 'web') {
                      var url = parametersData.httpBaseUrl + '/get-client-token';
                    }
                    oxd.Request.url = url;
                    oxd.get_client_access_token(oxd.Request, function (access_token_response) {
                      var access_token_data = JSON.parse(access_token_response);
                      oxd.Request.protection_access_token = access_token_data.data.access_token;
                      oxd.Request.refresh_token = refresh_token;
                      oxd.Request.oxd_id = obj.oxd_id;
                      if (obj.conn_type == 'local') {
                        var url = '';
                      } else if (obj.conn_type == 'web') {
                        var url = parametersData.httpBaseUrl + '/get-access-token-by-refresh-token';
                      }
                      oxd.Request.url = url;
                      oxd.get_access_token_by_refresh_token(oxd.Request, function (access_token) {
                        oxd.Request.oxd_id = obj.oxd_id;
                        var access_token_data = JSON.parse(access_token);
                        oxd.Request.access_token = access_token_data.data.access_token;
                        if (obj.conn_type == 'local') {
                          var url = '';
                        } else if (obj.conn_type == 'web') {
                          var url = parametersData.httpBaseUrl + '/get-user-info';
                        }
                        oxd.Request.url = url;
                        oxd.get_user_info(oxd.Request, function (response) {
                          console.log(response);
                          response = JSON.parse(response);
                          var data = {};
                          data['userName'] = response.data.claims.name[0];
                          data['userEmail'] = response.data.claims.email[0];
                          res.render('login_redirect', {data: data});
                        });
                      });
                    });
                  }
                  else {
                    var data = {'error': 'please register first.'};
                    res.json(data);
                  }
                });
              });
            });
          } else {
            if (obj.conn_type == 'local') {
              var url = '';
            } else if (obj.conn_type == 'web') {
              var url = parametersData.httpBaseUrl + '/get-tokens-by-code';
            }
            oxd.Request.scope = ['openid', 'profile', 'email'];
            oxd.Request.url = url;
            oxd.get_tokens_by_code(oxd.Request, function (response) {
              response = JSON.parse(response);
              oxd.Request.oxd_id = obj.oxd_id;
              oxd.Request.access_token = response.data.access_token;
              if (obj.conn_type == 'local') {
                var url = '';
              } else if (obj.conn_type == 'web') {
                var url = parametersData.httpBaseUrl + '/get-user-info';
              }
              oxd.get_user_info(oxd.Request, function (response) {
                console.log(response);
                response = JSON.parse(response);
                var data = {};
                data['userName'] = response.data.claims.name[0];
                data['userEmail'] = response.data.claims.email[0];
                res.render('login_redirect', {data: data});
              });
            });
          }
        });
      });

    }
    else {
      var data = {'error': 'please register first.'};
      res.json(data);
    }
  });
});

router.get('/uma', function (req, res) {
  res.render('uma');
});

router.get('/protect', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    oxd.Request.client_id = obj.client_id;
    oxd.Request.client_secret = obj.client_secret;
    jsonfile.readFile(parameters, function (err, parametersData) {
      if (obj.conn_type == 'local') {
        var url = '';
      } else if (obj.conn_type == 'web') {
        var url = parametersData.httpBaseUrl + '/get-client-token';
      }
      oxd.Request.op_host = parametersData.op_host;
      oxd.Request.url = url;
      oxd.get_client_access_token(oxd.Request, function (access_token_response) {
        var access_token_data = JSON.parse(access_token_response);
        oxd.Request.protection_access_token = access_token_data.data.access_token;
        oxd.Request.oxd_id = obj.oxd_id;
        var resources = [
          {
            path: '/photo',
            conditions: [
              {
                httpMethods: ['GET'],
                scopes: ['https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1'],
                ticketScopes: ['https://scim-test.gluu.org/identity/seam/resource/restv1/scim/vas1']
              }
            ]
          }
        ];
        oxd.Request.resources = resources;
        if (obj.conn_type == 'local') {
          var url = '';
        } else if (obj.conn_type == 'web') {
          var url = parametersData.httpBaseUrl + '/uma-rs-protect';
        }
        oxd.Request.url = url;
        oxd.uma_rs_protect(oxd.Request, function (response) {
          res.render('uma_response', {data: response});
        });
      });
    });
  });
});

router.get('/check_access', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    oxd.Request.client_id = obj.client_id;
    oxd.Request.client_secret = obj.client_secret;
    jsonfile.readFile(parameters, function (err, parametersData) {
      if (obj.conn_type == 'local') {
        var url = '';
      } else if (obj.conn_type == 'web') {
        var url = parametersData.httpBaseUrl + '/get-client-token';
      }
      oxd.Request.url = url;
      oxd.Request.op_host = parametersData.op_host;
      oxd.get_client_access_token(oxd.Request, function (access_token_response) {
        var access_token_data = JSON.parse(access_token_response);
        oxd.Request.protection_access_token = access_token_data.data.access_token;
        oxd.Request.oxd_id = obj.oxd_id;
        if (obj.conn_type == 'local') {
          var url = '';
        } else if (obj.conn_type == 'web') {
          var url = parametersData.httpBaseUrl + '/uma-rs-check-access';
        }
        oxd.Request.url = url;
        oxd.Request.rpt = '';
        oxd.Request.http_method = 'GET';
        oxd.Request.path = '/photo';
        oxd.uma_rs_check_access(oxd.Request, function (response) {
          res.render('uma_response', {data: response});
        });
      });
    });

  });
});

router.get('/get_rpt', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    oxd.Request.client_id = obj.client_id;
    oxd.Request.client_secret = obj.client_secret;
    jsonfile.readFile(parameters, function (err, parametersData) {
      if (obj.conn_type == 'local') {
        var url = '';
      } else if (obj.conn_type == 'web') {
        var url = parametersData.httpBaseUrl + '/get-client-token';
      }
      oxd.Request.url = url;
      oxd.Request.op_host = parametersData.op_host;
      oxd.get_client_access_token(oxd.Request, function (access_token_response) {
        var access_token_data = JSON.parse(access_token_response);
        oxd.Request.protection_access_token = access_token_data.data.access_token;
        oxd.Request.oxd_id = obj.oxd_id;
        if (obj.conn_type == 'local') {
          var url = '';
        } else if (obj.conn_type == 'web') {
          var url = parametersData.httpBaseUrl + '/uma-rp-get-rpt';
        }
        oxd.Request.url = url;
        oxd.Request.ticket = '09f32169-de52-42fe-9796-59ba21637a64';
        oxd.uma_rp_get_rpt(oxd.Request, function (response) {
          res.render('uma_response', {data: response});
        });
      });
    });
  });
});

router.get('/claims_gathering_url', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    oxd.Request.client_id = obj.client_id;
    oxd.Request.client_secret = obj.client_secret;
    jsonfile.readFile(parameters, function (err, parametersData) {
      if (obj.conn_type == 'local') {
        var url = '';
      } else if (obj.conn_type == 'web') {
        var url = parametersData.httpBaseUrl + '/get-client-token';
      }
      oxd.Request.op_host = parametersData.op_host;
      oxd.Request.url = url;
      oxd.get_client_access_token(oxd.Request, function (access_token_response) {
        var access_token_data = JSON.parse(access_token_response);
        oxd.Request.protection_access_token = access_token_data.data.access_token;
        oxd.Request.oxd_id = obj.oxd_id;
        if (obj.conn_type == 'local') {
          var url = '';
        } else if (obj.conn_type == 'web') {
          var url = parametersData.httpBaseUrl + '/uma-rp-get-claims-gathering-url';
        }
        oxd.Request.ticket = '09f32169-de52-42fe-9796-59ba21637a64';
        oxd.Request.claims_redirect_uri = 'https://node.oxdexample.com:5053/settings';
        oxd.Request.url = url;
        console.log(oxd.Request);
        oxd.uma_rp_get_claims_gathering_url(oxd.Request, function (response) {
          res.render('uma_response', {data: response});
        });
      });
    });
  });
});

router.post('/GetLogoutUri', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    jsonfile.readFile(parameters, function (err, parametersData) {
      if (obj.has_registration_endpoint) {
        if (obj.oxd_id != '') {
          oxd.Request.oxd_id = obj.oxd_id;
          oxd.Request.client_id = obj.client_id;
          oxd.Request.client_secret = obj.client_secret;
          oxd.Request.op_host = parametersData.op_host;
          if (obj.conn_type == 'local') {
            var url = '';
          } else if (obj.conn_type == 'web') {
            var url = parametersData.httpBaseUrl + '/get-client-token';
          }
          oxd.Request.url = url;
          oxd.get_client_access_token(oxd.Request, function (access_token_response) {
            var access_token_data = JSON.parse(access_token_response);
            console.log('access_token_response');
            console.log(access_token_response);
            oxd.Request.protection_access_token = access_token_data.data.access_token;
            oxd.Request.state = null;
            if (obj.conn_type == 'local') {
              var url = '';
            } else if (obj.conn_type == 'web') {
              var url = parametersData.httpBaseUrl + '/get-logout-uri';
            }
            oxd.Request.url = url;
            oxd.get_logout_uri(oxd.Request, function (response) {
              console.log(response);
              response = JSON.parse(response);
              var data = {};
              data['logoutUri'] = response.data.uri;
              console.log('response');
              console.log(data);
              res.json(data);
            });
          });
        } else {
          var data = {'error': 'please register first.'};
          res.json(data);
        }
      } else {
        oxd.Request.oxd_id = obj.oxd_id;
        oxd.Request.op_host = parametersData.op_host;
        if (obj.conn_type == 'local') {
          var url = '';
        } else if (obj.conn_type == 'web') {
          var url = parametersData.httpBaseUrl + '/get-logout-uri';
        }
        oxd.Request.url = url;
        oxd.get_logout_uri(oxd.Request, function (response) {
          console.log(response);
          response = JSON.parse(response);
          var data = {};
          data['logoutUri'] = response.data.uri;
          console.log('response');
          console.log(data);
          res.json(data);
        });
      }
    });
  });
});


module.exports = router;
