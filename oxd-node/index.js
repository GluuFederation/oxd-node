var request = require('./model/request_param');
var util = require('util');
var utilities = require('./utilities/utility');
var httpRequest = require('request');
var curl = require('curlrequest');

exports.Request= request;

exports.register_site = function(request,url,callback)
{
  var data = {};
  var param = {};

  param.op_host  = request.op_host;
  param.authorization_redirect_uri = request.authorization_redirect_uri;
  param.scope =request.scope;
  param.contacts =request.contacts;
  param.application_type =request.application_type;
  param.post_logout_redirect_uri =request.post_logout_redirect_uri;
  param.redirect_uris =request.redirect_uris;
  param.response_types =request.response_types;
  param.client_id =request.client_id;
  param.client_secret =request.client_secret;
  param.client_jwks_uri =request.client_jwks_uri;
  param.client_token_endpoint_auth_method =request.client_token_endpoint_auth_method;
  param.client_request_uris =request.client_request_uris;
  param.client_logout_uris =request.client_logout_uris;
  param.client_sector_identifier_uri =request.client_sector_identifier_uri;
  param.ui_locales =request.ui_locales;
  param.claims_locales =request.claims_locales;
  param.acr_values =request.acr_values;
  param.grant_types =request.grant_types;
    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }
    console.log(request.port);
    if(url == "")
    {
        console.log(JSON.stringify(param));
        utilities.oxdSocketRequest(request.port,request.host,param,"register_site",function(response){
            callback(response);
        });
    }
    else{
            console.log(JSON.stringify(param));
            utilities.oxdHttpRequest(url,param,function(response){
                callback(response);
            })
        }

    }


exports.update_site_registration = function(request,url,callback)
{
  var data = {};
  var param = {};

  param.oxd_id = request.oxd_id;
  param.authorization_redirect_uri = request.authorization_redirect_uri;
  param.post_logout_redirect_uri = request.post_logout_redirect_uri;
  param.client_logout_uris = request.client_logout_uris;
  param.application_type = request.application_type;
  param.grant_types = request.grant_types;
  param.redirect_uris = request.redirect_uris;
  param.acr_values = request.acr_values;
  param.client_jwks_uri = request.client_jwks_uri;
  param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
  param.client_request_uris = request.client_request_uris;
  param.contacts = request.contacts;
  console.log(request);

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in request_param.js file');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"update_site_registration",function(response){
        callback(response);
    });
  }
  else{
    console.log(JSON.stringify(param));
    utilities.oxdHttpRequest(url,param,function(response){
        callback(response);
    });
  }

}

exports.get_authorization_url = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.acr_values = request.acr_values;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in request_param.js file');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_authorization_url",function(response){
        callback(response);
    });
  }
  else{
    console.log(JSON.stringify(param));
    utilities.oxdHttpRequest(url,param,function(response){
        callback(response);
    });
  }

}

exports.get_tokens_by_code = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.code = request.code;
  param.state = request.state;
  param.scopes = request.scopes;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in request_param.js file');
    return;
  }

  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_tokens_by_code",function(response){
        callback(response);
    });
  }
  else{
    console.log(JSON.stringify(param));
    utilities.oxdHttpRequest(url,param,function(response){
        callback(response);
    });
  }

}
exports.uma_rs_protect = function(request,callback)
{
    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.resources = request.resources;
    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }

    client.connect(request.port, 'localhost', function() {
       data.command = "uma_rs_protect";
       data.params = param;
       var string = JSON.stringify(data);
       console.log('Connected2');
       //console.log("Send Data : " + ("0" + string.length + string));
       try {
         if(string.length > 0 && string.length < 100){
           console.log("Send Data protect: " + ("00" + string.length + string));
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

exports.uma_rs_check_access = function(request,callback)
{
    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.rpt = "";
    param.http_method = "GET";
    param.path = "/scim";
    param.port = 8099;

    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }

    client.connect(request.port, 'localhost', function() {
       data.command = "uma_rs_check_access";
       data.params = param;
       var string = JSON.stringify(data);
       console.log('Connected3');
       //console.log("Send Data : " + ("0" + string.length + string));
       try {
         if(string.length > 0 && string.length < 100){
           console.log("Send Data1 : " + ("00" + string.length + string));
           client.write(("00" + string.length + string));
         }
         else if(string.length > 100 && string.length < 1000){
             console.log("Send Data2 : " + ("0" + string.length + string));
             client.write(("0" + string.length + string));
         }
       } catch (err) {
            console.log("send data3 error:" + err);
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

exports.get_user_info = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.access_token = request.access_token;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in request_param.js file');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_user_info",function(response){
        callback(response);
    });
  }
  else{
    console.log(JSON.stringify(param));
    utilities.oxdHttpRequest(url,param,function(response){
        callback(response);
    });
  }
}

exports.get_logout_uri = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.id_token_hint = request.id_token_hint;
  param.post_logout_redirect_uri = request.post_logout_redirect_uri;
  param.state = request.state;
  param.session_state = request.session_state;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in  file - get_logout_uri');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_logout_uri",function(response){
        callback(response);
    });
  }
  else{
    console.log(JSON.stringify(param));
    utilities.oxdHttpRequest(url,param,function(response){
        callback(response);
    });
  }
}
