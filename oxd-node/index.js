var net = require('net');
var request = require('./model/request_param');
var config = require('./configuration');
var util = require('util');

exports.Request = request;

function buffer_response(client, callback) {
  var length, buffer;

  client.on('data', function(req) {
      var data = req.toString();
      console.log('------------------');
      console.log("response : " + data);
      console.log('------------------');
      if(length === undefined) {
          length = parseInt(data.substring(0, 4));
          buffer = data.substr(4, data.length);
      }
      else {
          buffer = buffer + data;
      }

      if(buffer.length >= length) {
          console.log('------------------');
          console.log('response buffered');
          console.log('------------------');
          callback(buffer);
          client.end(); // kill client after server's response
      }
  });

  client.on('error', function(err) {
      console.log('------------------');
      console.log('error: ' + err);
      console.log('------------------');
      client.end(); // kill client after server's response
  });

  client.on('close', function() {
      console.log('------------------');
      console.log('Connection closed');
      console.log('------------------');
  });
}

function send_command(command, params, callback) {
    console.log('--------------------------------------------------------------------------------------------------' + command);
    var client = new net.Socket();
    var data = {};

    if (config.oxd_port == null || config.oxd_port == "") {
        console.log('Please configure port in request_param.js file - ' + cmd);
        return;
    }

    client.connect(config.oxd_port, 'localhost', function() {
        data.command = command;
        data.params = params;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        try {
            if (string.length > 0 && string.length < 100) {
                console.log('------------------');
                console.log("Send Data : " + ("00" + string.length + string));
                client.write(("00" + string.length + string));
                console.log('------------------');
            } else if (string.length > 100 && string.length < 1000) {
                console.log('------------------');
                console.log("Send Data : " + ("0" + string.length + string));
                client.write(("0" + string.length + string));
                console.log('------------------');
            }
        } catch (err) {
            console.log('------------------');
            console.log("send data error:" + err);
            console.log('------------------');
        }
    });

    buffer_response(client, callback);
}

exports.register_site = function(request, callback) {
    var param = {};

    param.op_host = config.op_host;
    param.authorization_redirect_uri = request.authorization_redirect_uri;
    param.scope = request.scope;
    param.contacts = config.contacts;
    param.application_type = request.application_type;
    param.post_logout_redirect_uri = request.post_logout_redirect_uri;
    param.response_types = request.response_types;
    param.client_id = request.client_id;
    param.client_secret = request.client_secret;
    param.client_jwks_uri = request.client_jwks_uri;
    param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
    param.client_request_uris = request.client_request_uris;
    param.client_logout_uris = request.client_logout_uris;
    param.client_sector_identifier_uri = request.client_sector_identifier_uri;
    param.ui_locales = request.ui_locales;
    param.claims_locales = request.claims_locales;
    param.acr_values = request.acr_values;
    param.grant_types = request.grant_types;

    send_command("register_site", param, callback);
}


exports.update_site_registration = function(request, callback) {
    var param = {};

    param.oxd_id = request.oxd_id;
    param.authorization_redirect_uri = request.authorization_redirect_uri;
    param.post_logout_redirect_uri = request.post_logout_redirect_uri;
    param.client_logout_uris = request.client_logout_uris;
    param.application_type = request.application_type;
    param.grant_types = request.grant_types;
    param.acr_values = request.acr_values;
    param.scope = request.scope;
    param.client_jwks_uri = request.client_jwks_uri;
    param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
    param.client_request_uris = request.client_request_uris;
    param.contacts = config.contacts;

    send_command("update_site_registration", param, callback);
}

exports.get_authorization_url = function(request, callback) {
    var param = {};
    param.oxd_id = request.oxd_id;
    param.acr_values = request.acr_values;
    param.prompt = 'login';

    send_command("get_authorization_url", param, callback);
}

exports.get_tokens_by_code = function(request, callback) {
    var param = {};
    param.oxd_id = request.oxd_id;
    param.code = request.code;
    param.state = request.state;
    param.nonce = request.nonce;

    send_command("get_tokens_by_code", param, callback);
}

exports.get_user_info = function(request, callback) {
    var param = {};
    param.oxd_id = request.oxd_id;
    param.access_token = request.access_token;

    send_command("get_user_info", param, callback);
}

exports.get_logout_uri = function(request, callback) {
    var param = {};
    param.oxd_id = request.oxd_id;
    param.id_token_hint = request.id_token_hint;
    param.post_logout_redirect_uri = request.post_logout_redirect_uri;
    param.state = request.state;
    param.session_state = request.session_state;

    send_command("get_logout_uri", param, callback);
}

exports.uma_rp_authorize_rpt = function(request,callback){
    if(request.oxd_id == null ||request.oxd_id == undefined)
    {
        console.log("Oxd ID is required for authorizing RPT -AuthorizeRpt.");
        return;
    }

    if(request.rpt == null ||request.rpt == undefined)
    {
        console.log("Valid RPT is required for authorizing RPT - AuthorizeRpt.");
        return;
    }

    if(request.ticket == null ||request.ticket == undefined)
    {
        console.log("Valid ticket is required for authorizing RPT - AuthorizeRpt.");
        return;
    }

    var param = {};
    param.oxd_id = request.oxd_id;
    param.rpt = request.rpt;
    param.ticket = request.ticket;

    send_command("uma_rp_authorize_rpt", param, callback);
}

exports.uma_rp_get_rpt = function(request,callback){
    if(request.oxd_id == null ||request.oxd_id == undefined)
    {
        console.log("Oxd ID is required for authorizing RPT -uma_rp_get_rpt.");
        return;
    }

    var param = {};
    param.oxd_id = request.oxd_id;

    send_command("uma_rp_get_rpt", param, callback);
}

exports.uma_rs_check_access = function(request,callback){
    if(request.oxd_id == null ||request.oxd_id == undefined)
    {
        console.log("Oxd ID is required for authorizing RPT -uma_rs_check_access.");
        return;
    }

    if(request.path == null ||request.path == undefined)
    {
        console.log("Path is required for authorizing RPT -uma_rs_check_access.");
        return;
    }

    if(request.http_method == null ||request.http_method == undefined)
    {
        console.log("HttpMethod is required for authorizing RPT -uma_rs_check_access.");
        return;
    }

    var param = {};
    param.oxd_id = request.oxd_id;
    param.path = request.path;
    param.http_method = request.http_method;
    param.rpt=request.rpt;

    send_command("uma_rs_check_access", param, callback);
}

exports.uma_rs_protect = function(request,callback){
    if(request.oxd_id == null ||request.oxd_id == undefined)
    {
        console.log("Oxd ID is required for authorizing RPT -uma_rs_protect.");
        return;
    }

    if (config.oxd_port == null || config.oxd_port == "") {
        console.log('Please configure port in request_param.js file - uma_rs_protect');
        return;
    }

    if(request.resources == null ||request.resources == undefined || request.resources.length==0)
    {
        console.log("Valid resources are required for protecting UMA resource in RS.- uma_rs_protect");
        return;
    }

    var param = {};
    param.oxd_id = request.oxd_id;
    param.resources = request.resources;

    send_command("uma_rs_protect", param, callback);
}
