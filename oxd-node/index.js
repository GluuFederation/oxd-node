var net = require('net');
var request = require('./model/request_param');
var util = require('util');
var client = new net.Socket();

exports.Request= request;

exports.register_site = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.authorization_redirect_uri = request.authorization_redirect_uri;
  param.scope = request.scope;
  param.application_type = request.application_type;
  param.response_types = request.response_types;
  param.client_id = request.client_id;
  param.client_secret = request.client_secret;
  param.post_logout_redirect_uri = request.post_logout_redirect_uri;
  param.application_type = request.application_type;
  param.redirect_uris = request.redirect_uris;
  param.acr_values = request.acr_values;
  param.client_sector_identifier_uri = request.client_sector_identifier_uri;
  param.ui_locales = request.ui_locales;
  param.claims_locales = request.claims_locales;
  param.grant_types = request.grant_types;
  param.client_jwks_uri = request.client_jwks_uri;
  param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
  param.client_request_uris = request.client_request_uris;
  param.client_logout_uris = request.client_logout_uris;
  param.contacts = request.contacts;
  //param.client_secret_expires_at = request.client_secret_expires_at;

  client.connect(8099, 'localhost', function() {
    data.command = "register_site";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    callback(data.substring(4,data.length));
  	client.end(); // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}

exports.update_site_registration = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.authorization_redirect_uri = request.authorization_redirect_uri;
  param.scope = request.scope;
  param.application_type = request.application_type;
  param.response_types = request.response_types;
  param.client_id = request.client_id;
  param.client_secret = request.client_secret;
  param.post_logout_redirect_uri = request.post_logout_redirect_uri;
  param.application_type = request.application_type;
  param.redirect_uris = request.redirect_uris;
  param.acr_values = request.acr_values;
  param.client_sector_identifier_uri = request.client_sector_identifier_uri;
  param.ui_locales = request.ui_locales;
  param.claims_locales = request.claims_locales;
  param.grant_types = request.grant_types;
  param.client_jwks_uri = request.client_jwks_uri;
  param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
  param.client_request_uris = request.client_request_uris;
  param.client_logout_uris = request.client_logout_uris;
  param.contacts = request.contacts;
  param.client_secret_expires_at = request.client_secret_expires_at;

  client.connect(8099, 'localhost', function() {
    data.command = "update_site_registration";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    callback(data.substring(4,data.length));
  	client.end(); // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}

exports.get_authorization_url = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.acr_values = request.acr_values;

  client.connect(8099, 'localhost', function() {
    data.command = "get_authorization_url";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    client.end();
    callback(data.substring(4,data.length));
  	 // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}

exports.get_tokens_by_code = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.code = request.code;
  param.state = request.state;
  param.scopes = request.scopes;

  client.connect(8099, 'localhost', function() {
    data.command = "get_tokens_by_code";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    callback(data.substring(4,data.length));
  	client.end(); // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}

exports.get_user_info = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.access_token = request.access_token;


  client.connect(8099, 'localhost', function() {
    data.command = "get_user_info";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    callback(data.substring(4,data.length));
  	client.end(); // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}

exports.logout = function(request,callback)
{
  client = new net.Socket();
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.id_token = request.id_token;
  param.post_logout_redirect_uri = request.post_logout_redirect_uri;
  param.http_based_logout = request.http_based_logout;


  client.connect(8099, 'localhost', function() {
    data.command = "logout";
    data.params = param;
    var string = JSON.stringify(data);
    console.log('Connected');
    //console.log("Send Data : " + ("0" + string.length + string));
    try {
      if(string.length > 0 && string.length < 100){
        console.log("Send Data : " + ("00" + string.length + string));
        client.write(("00" + string.length + string));
      }
      else if(string.length > 100 && string.length < 1000){
          console.log("Send Data : " + ("0" + string.length + string));
          client.write(("0" + string.length + string));
      }
    } catch (err) {
         console.log("send data error:" + err);
    }
  });
  client.on('data', function(req) {
    var data = req.toString();
    console.log("response : " + data);
    callback(data.substring(4,data.length));
  	client.end(); // kill client after server's response
  });

  client.on('error', function(err) {
  	console.log('error: ' + err);
  	client.end(); // kill client after server's response
  });

  client.on('close', function() {
  	console.log('Connection closed');
  });

}
