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
    res.render('settings', {oxdObject: oSetting, port: process.env.PORT});
  });
});

router.get('/delete', function (req, res) {
  jsonfile.readFile(setting, function (err, oSetting) {
    if (oSetting.oxd_id) {
      if (oSetting.https_extension) {
        return oxd.get_client_token(oSetting, function (err, resToken) {
          if (err) {
            return res.status(500).json(err);
          }

          oSetting.protection_access_token = resToken.data.access_token;
          oxd.remove_site(oSetting, function (err, resAuth) {
            if (err) {
              return res.status(500).json(err);
            }

            return jsonfile.writeFile(setting, {}, function () {
              return res.redirect('/settings');
            });
          });
        });
      } else {
        return oxd.remove_site(oSetting, function (err, response) {
          if (err) {
            return res.status(500).json(err);
          }

          return jsonfile.writeFile(setting, {}, function () {
            return res.redirect('/settings');
          });
        });
      }

    }
    else {
      return res.json({'error': 'please register first.'});
    }
  });
});

router.post('/register', function (req, res) {
  var scopes = ['openid', 'profile', 'email', 'uma_protection'];
  var oxdRequest = {
    scope: scopes,
    grant_types: ['authorization_code'],
    authorization_redirect_uri: req.body.redirect_uri,
    post_logout_redirect_uri: req.body.post_logout_uri,
    op_host: req.body.op_host,
    client_name: req.body.client_name
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
    oxdRequest.port = req.body.oxd_local_value;
  } else if (req.body.conn_type == 'web') {
    oxdRequest.https_extension = true;
    oxdRequest.host = req.body.oxd_web_value;
  }

  oxd.setup_client(oxdRequest, function (err, response) {
    console.log(response);
    if (err) {
      return res.status(500).json(err);
    }

    if (response.status && response.status == 'ok') {
      response.data.client_name = req.body.client_name;
      response.data.message = 'Successfully Registered';
      response.data.https_extension = oxdRequest.https_extension;
      response.data.host = oxdRequest.host;
      response.data.port = req.body.oxd_local_value;
      jsonfile.writeFile(setting, response.data, function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.json(response.data);
      });
    } else {
      return res.status(400).json(response);
    }
  });
});

router.post('/update', function (req, res) {
  jsonfile.readFile(setting, function (err, obj) {
    if (obj.oxd_id != '') {
      jsonfile.readFile(setting, function (err, oSetting) {
        oSetting.op_host = req.body.op_host || oSetting.op_host;
        oSetting.client_id = req.body.client_id || oSetting.client_id;
        oSetting.client_secret = req.body.client_secret || oSetting.client_secret;
        oSetting.client_name = req.body.client_name || oSetting.client_name;

        if (req.body.conn_type == 'local') {
          oSetting.https_extension = false;
          oSetting.host = 'localhost';
          oSetting.port = req.body.oxd_local_value || oSetting.port;
        } else if (req.body.conn_type == 'web') {
          oSetting.https_extension = true;
          oSetting.host = req.body.oxd_web_value || oSetting.host;
        }

        if (oSetting.https_extension) {
          oxd.get_client_token(oSetting, function (err, resToken) {
            if (err) {
              return res.status(500).json(err);
            }

            oSetting.protection_access_token = resToken.data.access_token;
            oxd.update_site(oSetting, function (err, resSite) {
              if (err) {
                return res.status(500).json(err);
              }
              jsonfile.writeFile(setting, oSetting, function (err) {
                if (err) {
                  return res.status(500).json(err);
                }
                return res.json(oSetting);
              });
            });
          });
        } else {
          oxd.update_site(oSetting, function (err, resSite) {
            if (err) {
              return res.status(500).json(err);
            }
            jsonfile.writeFile(setting, oSetting, function (err) {
              if (err) {
                return res.status(500).json(err);
              }
              return res.json(oSetting);
            });
          });
        }
      });
    }
    else {
      var data = {'error': 'please register first.'};
      res.json(data);
    }
  });
});

router.get('/authorization', function (req, res) {
  jsonfile.readFile(setting, function (err, oSetting) {
    if (oSetting.oxd_id) {
      /**
       * Get UserInfo
       */
      if (req.query.code && req.query.state) {

        if (oSetting.https_extension) {
          oxd.get_client_token(oSetting, function (err, resToken) {
            if (err) {
              return res.status(500).json(err);
            }

            oSetting.state = req.query.state;
            oSetting.code = req.query.code;
            oSetting.protection_access_token = resToken.data.access_token;

            oxd.get_tokens_by_code(oSetting, function (err, resTokenCode) {
              if (err) {
                return res.status(500).json(err);
              }
              oSetting.access_token = resTokenCode.data.access_token;
              oxd.get_user_info(oSetting, function (err, resAuth) {
                if (err) {
                  return res.status(500).json(err);
                }

                console.log(resAuth.data.claims);

                if (!resAuth.data.claims.email) {
                  return res.status(500).send({message: 'Email Not found in return scope.'});
                }

                var data = {
                  email: resAuth.data.claims.email[0] || '',
                  name: resAuth.data.claims.name[0] || ''
                };
                return res.render('userinfo', data);
              });
            });
          });

        } else {
          oSetting.state = req.query.state;
          oSetting.code = req.query.code;

          oxd.get_tokens_by_code(oSetting, function (err, resTokenCode) {
            if (err) {
              return res.status(500).json(err);
            }
            oSetting.access_token = resTokenCode.data.access_token;
            oxd.get_user_info(oSetting, function (err, resAuth) {
              if (err) {
                return res.status(500).json(err);
              }

              console.log(resAuth.data.claims);

              if (!resAuth.data.claims.email) {
                return res.status(500).send({message: 'Email Not found in return scope.'});
              }

              var data = {
                email: resAuth.data.claims.email[0] || '',
                name: resAuth.data.claims.name[0] || ''
              };
              return res.render('userinfo', data);
            });
          });
        }
      } else {
        /**
         * Get Authorization URL
         */
        if (oSetting.https_extension) {
          oxd.get_client_token(oSetting, function (err, resToken) {
            if (err) {
              return res.status(500).json(err);
            }

            oSetting.protection_access_token = resToken.data.access_token;
            oxd.get_authorization_url(oSetting, function (err, resAuth) {
              if (err) {
                return res.status(500).json(err);
              }

              console.log(resAuth.data.authorization_url);
              return res.redirect(resAuth.data.authorization_url);
            });
          });
        } else {
          oxd.get_authorization_url(oSetting, function (err, response) {
            if (err) {
              return res.status(500).json(err);
            }

            console.log(response.data.authorization_url);
            return res.redirect(response.data.authorization_url);
          });
        }
      }
    }
    else {
      return res.json({'error': 'please register first.'});
    }
  });
});

router.get('/Login', function (req, res) {
  res.render('login');
});

router.get('/logout', function (req, res) {
  jsonfile.readFile(setting, function (err, oSetting) {
    if (oSetting.oxd_id) {
      if (oSetting.https_extension) {
        oxd.get_client_token(oSetting, function (err, resToken) {
          if (err) {
            return res.status(500).json(err);
          }

          oSetting.protection_access_token = resToken.data.access_token;
          oxd.get_logout_uri(oSetting, function (err, resAuth) {
            if (err) {
              return res.status(500).json(err);
            }

            console.log(resAuth.data.uri);
            return res.redirect(resAuth.data.uri);
          });
        });
      } else {
        oxd.get_logout_uri(oSetting, function (err, response) {
          if (err) {
            return res.status(500).json(err);
          }

          console.log(response.data.uri);
          return res.redirect(response.data.uri);
        });
      }
    }
    else {
      return res.json({'error': 'please register first.'});
    }
  });
});


module.exports = router;
