const utilities = require('./utility');

/**
 * Exports All the methods
 * @param {object} config - All Global properties
 */
module.exports = (config) => {
  const module = {};

  /**
   * Function to register the site and generate a unique ID for the site.
   * If you are using the oxd-https-extension, you must setup the client.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.setup_client = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/setup-client`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'setup_client', (err, response) => callback(err, response));
    }
  };

  /**
   * Function is  used to get a token which is sent as an input parameter for other methods when the protect_commands_with_access_token is enabled in oxd-server.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_client_token = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-client-token`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_client_token', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to register the site and generate a unique ID for the site
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.register_site = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/register-site`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'register_site', (err, response) => callback(err, response));
    }
  };

  /**
   * Fucntion to update the site's information with OpenID Provider.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.update_site = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/update-site`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'update_site', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to get the authorization https_extension that can be opened in the browser for the user to provide authorization and authentication
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_authorization_url = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-authorization-url`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_authorization_url', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to get access code for getting the user details from the OP. It is called after the user authorizes by visiting the authorization URL.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_tokens_by_code = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-tokens-by-code`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_tokens_by_code', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to get access code for using refresh token
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_access_token_by_refresh_token = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-access-token-by-refresh-token`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_access_token_by_refresh_token', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to get the information about the user using the access code obtained from the OP
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_user_info = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-user-info`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_user_info', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to logout the user
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.get_logout_uri = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/get-logout-uri`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'get_logout_uri', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to be used in a UMA Resource Server to protect resources.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.uma_rs_protect = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/uma-rs-protect`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rs_protect', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to be used in a UMA Resource Server to check access.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.uma_rs_check_access = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/uma-rs-check-access`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rs_check_access', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to be used by a UMA Requesting Party to get RPT token.
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.uma_rp_get_rpt = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/uma-rp-get-rpt`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rp_get_rpt', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to get the authorization https_extension that can be opened in the browser for the user to provide authorization and authentication
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.uma_rp_get_claims_gathering_url = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/uma-rp-get-claims-gathering-url`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'uma_rp_get_claims_gathering_url', (err, response) => callback(err, response));
    }
  };

  /**
   * Function to remove the site from oxd-server
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.remove_site = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/remove-site`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'remove_site', (err, response) => callback(err, response));
    }
  };
  
  /**
   * Function to introspect the access_token
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.introspect_access_token = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/introspect-access-token`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'introspect_access_token', (err, response) => callback(err, response));
    }
  };
  
  /**
   * Function to introspect the RPT
   * @param {object} param - All required properties
   * @param {function} callback - Callback response function. It return with two parameters.
   * {object} err - error response
   * {object} response - success response
   */
  module.introspect_rpt = (param, callback) => {
    // Filtered parameters
    const data = filterParameters(param);

    // If https_extension is set the request goes to oxd-https-extension
    if (data.https_extension) {
      utilities.oxdHttpRequest(`${data.host}/introspect-rpt`, data, (err, response) => callback(err, response));
    } else {
      // If https_extension is not set then request goes to oxd-server
      utilities.oxdSocketRequest(data.port, data.host, data, 'introspect_rpt', (err, response) => callback(err, response));
    }
  };

  // Filter parameters
  function filterParameters(request) {
    const data = Object.assign({}, config);
    Object.keys(request).forEach((key) => {
      data[key] = request[key];
    });

    return data;
  }

  return module;
};
