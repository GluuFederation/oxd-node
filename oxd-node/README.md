# oxd-node-library

oxd-node-library is a client library for the Gluu oxd Server. For information about oxd, visit [http://oxd.gluu.org](http://oxd.gluu.org) 

## Prerequisites

#### Mandatory
- Node >= 6.x.x and NPM >= 3.x.x
- [GLUU Server](https://www.gluu.org/)
- [OXD Server](https://gluu.org/docs/oxd)

#### Optional
OXD-TO-HTTP Server is required if you want to access OXD server over HTTP.

## Installation

```
$ npm install oxd-node
```

## Important Links

* [oxd docs](https://gluu.org/docs/oxd)
* See the code of a [oxd-node-demo](https://github.com/GluuFederation/oxd-node/tree/master/oxd-node-demo) built using oxd-node.
* Browse the oxd-node [source code on Github](https://github.com/GluuFederation/oxd-node).


## Configuration 

oxd-node can communicate with the oxd server via sockets or HTTPS. There is no difference in code--just toggle the https_extension configuration property. Sockets are used when the oxd server is running locally.

### Configuration for oxd-server via sockets:

```
const config = {
  https_extension: false,
  host: 'localhost',
  port: '8099'
};

const oxd = require('oxd-node')(config);
```

### Configuration for oxd-https-extension:

```
const config = {
  https_extension: true,
  host: 'https://server.running.oxd-https-extension',
};

const oxd = require('oxd-node')(config);
```


## Sample code

### setup_client

```
oxd.setup_client({
  op_host: 'https://<ophostname>',
  authorization_redirect_uri: 'https://client.example.org/cb',
  scope: ['openid', 'email', 'profile', 'uma_protection'],
  grant_types: ['authorization_code'],
  client_name: 'oxd_node_client'
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### register_site

```
oxd.register_site({
  op_host: 'https://<ophostname>',
  authorization_redirect_uri: 'https://client.example.org/cb',
  scope: ['openid', 'email', 'profile', 'uma_protection'],
  grant_types: ['authorization_code'],
  client_name: 'oxd_node_client',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### update_site

```
oxd.update_site({
  op_host: 'https://gluu.local.org',
  authorization_redirect_uri: 'https://localhost:1338',
  scope: ['openid', 'email', 'profile', 'uma_protection'],
  grant_types: ['authorization_code'],
  client_name: 'oxd_node_client',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});

```

### get_client_token

```
oxd.get_client_token({
  client_id: '<client id>',
  client_secret: '<client secret>',
  scope: ['openid', 'email', 'profile', 'uma_protection'],
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### get_authorization_url

```
oxd.get_authorization_url({
  oxd_id: '0de8572c-dadb-4cc4-acc1-d7f6d795c7f5',
  scope: ['openid', 'profile', 'email', 'uma_protection'],
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### get_tokens_by_code

```
oxd.get_tokens_by_code({
  oxd_id: '0de8572c-dadb-4cc4-acc1-d7f6d795c7f5',
  code: 'eb50bdb4-eab0-4b64-bf4a-47f5cd00e972',
  state: '85pt66osg5dhjmtp3fb57oh91q',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### get_access_token_by_refresh_token

```
oxd.get_access_token_by_refresh_token({
  oxd_id: '0de8572c-dadb-4cc4-acc1-d7f6d795c7f5',
  refresh_token: '4e3758c6-8b0d-477c-9456-3dd9445048bb',
  scope: ['openid', 'profile'],
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### get_user_info

```
oxd.get_user_info({
  oxd_id: '0de8572c-dadb-4cc4-acc1-d7f6d795c7f5',
  access_token: '3241d021-1198-46c9-9a57-f6ecbcbada7c',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### get_logout_uri

```
oxd.get_logout_uri({
  oxd_id: '0de8572c-dadb-4cc4-acc1-d7f6d795c7f5',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }

  console.log(response);
});
```

### uma_rs_protect

```
oxd.uma_rs_protect({
    oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
    protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
    resources: [
      {
        path: '/photo',
        conditions: [
          {
            httpMethods: [
              'GET'
            ],
            scope_expression: {
              rule: {
                and: [
                  {
                    or: [
                      {
                        var: 0
                      },
                      {
                        var: 1
                      }
                    ]
                  },
                  {
                    var: 2
                  }
                ]
              },
              data: [
                'http://photoz.example.com/dev/actions/all',
                'http://photoz.example.com/dev/actions/add',
                'http://photoz.example.com/dev/actions/internalClient'
              ]
            }
          },
          {
            httpMethods: [
              'PUT',
              'POST'
            ],
            scope_expression: {
              rule: {
                and: [
                  {
                    or: [
                      {
                        var: 0
                      },
                      {
                        var: 1
                      }
                    ]
                  },
                  {
                    var: 2
                  }
                ]
              },
              data: [
                'http://photoz.example.com/dev/actions/all',
                'http://photoz.example.com/dev/actions/add',
                'http://photoz.example.com/dev/actions/internalClient'
              ]
            }
          }
        ]
      }
    ]
  },
  (err, response) => {
    if (err) {
      console.log('Error : ', err);
      return;
    }

    console.log(response);
  });
```

### uma_rs_check_access

```
oxd.uma_rs_check_access({
  oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
  rpt: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
  path: '<path of resource>',
  http_method: '<http method of RP request>',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }
  console.log(response);
});

```

### uma_rp_get_rpt

```
oxd.uma_rp_get_rpt({
  oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
  ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }
  console.log(response);
});
```

### uma_rp_get_claims_gathering_url

```
oxd.uma_rp_get_claims_gathering_url({
  oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
  ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
  claims_redirect_uri: 'https://client.example.com/cb',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }
  console.log(response);
});
```

### remove_site

```
oxd.remove_site({
  oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
  protection_access_token:'<access token of the client>'       <- OPTIONAL for `oxd-server` but REQUIRED for `oxd-https-extension`.
}, (err, response) => {
  if (err) {
    console.log('Error : ', err);
    return;
  }
  console.log(response);
});
```

## Test

oxd-node contains extensive tests for quality assurance

```
npm test
```

## Examples

The oxd-node-demo directory contains apps using oxd-node for OpenID Connect.

## Support

Please report technical issues and suspected bugs on our [Support Page](https://support.gluu.org/). You can use the same credentials you created to register your oxd license to sign in on Gluu support.
