var net = require('net');
var request = require('./model/request_param');
var util = require('util');
var client = new net.Socket();

exports.Request = request;

exports.register_site = function(request, callback) {

    console.log('--------------------------------------------------------------------------------------------------register_site');
    client = new net.Socket();
    var data = {};
    var param = {};

    param.op_host = request.op_host;
    param.authorization_redirect_uri = request.authorization_redirect_uri;
    param.scope = request.scope;
    param.contacts = request.contacts;
    param.application_type = request.application_type;
    param.post_logout_redirect_uri = request.post_logout_redirect_uri;
    param.redirect_uris = request.redirect_uris;
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

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - register_site');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "register_site";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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

    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        callback(data.substring(4, data.length));
        client.end(); // kill client after server's response
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


exports.update_site_registration = function(request, callback) {

    console.log('--------------------------------------------------------------------------------------------------update_site_registration');
    client = new net.Socket();
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
    param.scope = request.scope;
    param.client_jwks_uri = request.client_jwks_uri;
    param.client_token_endpoint_auth_method = request.client_token_endpoint_auth_method;
    param.client_request_uris = request.client_request_uris;
    param.contacts = request.contacts;

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - update_site_registration');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "update_site_registration";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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
    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        callback(data.substring(4, data.length));
        client.end(); // kill client after server's response
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

exports.get_authorization_url = function(request, callback) {
    console.log('--------------------------------------------------------------------------------------------------get_authorization_url');

    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.acr_values = request.acr_values;

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - get_authorization_url');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "get_authorization_url";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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
    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        client.end();
        callback(data.substring(4, data.length));
        // kill client after server's response
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

exports.get_tokens_by_code = function(request, callback) {
    console.log('--------------------------------------------------------------------------------------------------get_tokens_by_code');

    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.code = request.code;
    param.state = request.state;
    param.scopes = request.scope;

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - get_tokens_by_code');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "get_tokens_by_code";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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
    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        callback(data.substring(4, data.length));
        client.end(); // kill client after server's response
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

exports.get_user_info = function(request, callback) {
    console.log('--------------------------------------------------------------------------------------------------get_user_info');

    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.access_token = request.access_token;

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - get_user_info');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "get_user_info";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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
    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        callback(data.substring(4, data.length));
        client.end(); // kill client after server's response
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

exports.get_logout_uri = function(request, callback) {
    console.log('--------------------------------------------------------------------------------------------------get_logout_uri');
    client = new net.Socket();
    var data = {};
    var param = {};
    param.oxd_id = request.oxd_id;
    param.id_token_hint = request.id_token_hint;
    param.post_logout_redirect_uri = request.post_logout_redirect_uri;
    param.state = request.state;
    param.session_state = request.session_state;

    if (request.port == null || request.port == "") {
        console.log('Please configure port in request_param.js file - get_logout_uri');
        return;
    }

    client.connect(request.port, 'localhost', function() {
        data.command = "get_logout_uri";
        data.params = param;
        var string = JSON.stringify(data);
        console.log('------------------');
        console.log('Connected');
        console.log('------------------');
        //console.log("Send Data : " + ("0" + string.length + string));
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
    client.on('data', function(req) {
        var data = req.toString();
        console.log('------------------');
        console.log("response : " + data);
        console.log('------------------');
        callback(data.substring(4, data.length));
        client.end(); // kill client after server's response
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
