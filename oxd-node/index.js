var utilities = require('./utilities/utility');

/**
 * Exports All the methods
 * @param {object} config - All Global properties
 * @returns methods
 */
module.exports = function (config) {
  var module = {};

  /**
   * Function to register the site and generate a unique ID for the site. If you are using the oxd-https-extension, you must setup the client.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.setup_client = function setup_client(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/setup-client', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'setup_client', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function is used to get a token which is sent as an input parameter for other methods when the protect_commands_with_access_token is enabled in oxd-server.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_client_token = function get_client_token(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-client-token', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_client_token', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to register the site and generate a unique ID for the site
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.register_site = function register_site(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/register-site', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'register_site', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Fucntion to update the site's information with OpenID Provider.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.update_site_registration = function update_site_registration(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/update-site', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'update_site_registration', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to get the authorization url that can be opened in the browser for the user to provide authorization and authentication
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_authorization_url = function get_authorization_url(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-authorization-url', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_authorization_url', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to get access code for getting the user details from the OP. It is called after the user authorizes by visiting the authorization URL.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_tokens_by_code = function get_tokens_by_code(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-tokens-by-code', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_tokens_by_code', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to get access code for using refresh token
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_access_token_by_refresh_token = function get_access_token_by_refresh_token(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-access-token-by-refresh-token', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_access_token_by_refresh_token', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to get the information about the user using the access code obtained from the OP
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_user_info = function get_user_info(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-user-info', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_user_info', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to logout the user
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.get_logout_uri = function get_logout_uri(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/get-logout-uri', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_logout_uri', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to be used in a UMA Resource Server to protect resources.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.uma_rs_protect = function uma_rs_protect(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/uma-rs-protect', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rs_protect', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to be used in a UMA Resource Server to check access.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.uma_rs_check_access = function uma_rs_check_access(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/uma-rs-check-access', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rs_check_access', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to be used by a UMA Requesting Party to get RPT token.
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.uma_rp_get_rpt = function uma_rp_get_rpt(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/uma-rp-get-rpt', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rp_get_rpt', function (err, response) {
        return callback(err, response);
      });
    }
  };

  /**
   * Function to get the authorization url that can be opened in the browser for the user to provide authorization and authentication
   * @param {object} param - All required properties
   * @returns {function} callback - Callback response function.
   */
  module.uma_rp_get_claims_gathering_url = function uma_rp_get_claims_gathering_url(param, callback) {
    // Filtered parameters
    var data = filterParameters(param);

    // If url is set the request goes to oxd-https-extension
    if (!!data.url) {
      utilities.oxdHttpRequest(data.url + '/uma-rp-get-claims-gathering-url', data, function (err, response) {
        return callback(err, response);
      });
    } else {
      // If url is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rp_get_claims_gathering_url', function (err, response) {
        return callback(err, response);
      });
    }
  };

  // Filter parameters
  function filterParameters(request) {
    var data = config;
    Object.keys(request).forEach(function (key) {
      data[key] = request[key];
    });

    return data;
  }

  return module;
};
