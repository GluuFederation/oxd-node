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

exports.setup_client = function(request,url,callback)
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
        utilities.oxdSocketRequest(request.port,request.host,param,"setup_client",function(response){
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

exports.get_client_access_token = function(request,url,callback)
{
    var param = {};
    param.op_host  = request.op_host;
    param.client_id = request.client_id;
    param.client_secret = request.client_secret;
    param.oxd_id = request.oxd_id;

    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }
    if(url == "")
    {
      console.log(JSON.stringify(param));
      utilities.oxdSocketRequest(request.port,request.host,param,"get_client_token",function(response){
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
  param.protection_access_token = request.protection_access_token;
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
  param.scope = request.scope;
  param.acr_values = request.acr_values;
  param.access_token = request.access_token;
  param.protection_access_token = request.protection_access_token;

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
  param.protection_access_token = request.protection_access_token;

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

exports.get_access_token_by_refresh_token = function(request,url,callback){
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.refresh_token = request.refresh_token;
  param.scope = request.scope;
  param.protection_access_token = request.protection_access_token;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in request_param.js file');
    return;
  }

  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_access_token_by_refresh_token",function(response){
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

exports.uma_rs_protect = function(request,url,callback){
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.resources = request.resources;
    param.protection_access_token = request.protection_access_token;
    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }

    if(url == "")
    {
      console.log(JSON.stringify(param));
      utilities.oxdSocketRequest(request.port,request.host,param,"uma_rs_protect",function(response){
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

exports.uma_rs_check_access = function(request,url,callback)
{
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.rpt = request.rpt;
    param.http_method = request.http_method;
    param.path = request.path;
    param.port = 8099;
    param.protection_access_token = request.protection_access_token;

    if(request.port== null || request.port == "")
    {
      console.log('Please configure port in request_param.js file');
      return;
    }

    if(url == "")
    {
      console.log(JSON.stringify(param));
      utilities.oxdSocketRequest(request.port,request.host,param,"uma_rs_check_access",function(response){
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

exports.get_user_info = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.access_token = request.access_token;
  param.protection_access_token = request.protection_access_token;

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
  param.protection_access_token = request.protection_access_token;

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

exports.uma_rp_get_rpt = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.ticket = request.ticket;
  param.claim_token = request.claim_token;
  param.claim_token_format = request.claim_token_format;
  param.pct = request.pct;
  param.rpt = request.rpt;
  param.scope = request.scope;
  param.state = request.state;
  param.protection_access_token = request.protection_access_token;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in  file - uma_rp_get_rpt');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"uma_rp_get_rpt",function(response){
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

exports.uma_rp_get_claims_gathering_url = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.ticket = request.ticket;
  param.claims_redirect_uri = request.claims_redirect_uri;
  param.protection_access_token = request.protection_access_token;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in  file - uma_rp_get_claims_gathering_url');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"uma_rp_get_claims_gathering_url",function(response){
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

exports.get_access_token_by_refresh_token = function(request,url,callback)
{
  var data = {};
  var param = {};
  param.oxd_id = request.oxd_id;
  param.refresh_token = request.refresh_token;
  param.scope = request.scope;
  param.protection_access_token = request.protection_access_token;

  if(request.port== null || request.port == "")
  {
    console.log('Please configure port in  file - get_access_token_by_refresh_token');
    return;
  }
  if(url == "")
  {
    console.log(JSON.stringify(param));
    utilities.oxdSocketRequest(request.port,request.host,param,"get_access_token_by_refresh_token",function(response){
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
