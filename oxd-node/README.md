# oxd-node

oxd-node is oxD Server client implemented in node.js, using it you can integrate oxD server in your application.

### Installation

##### Note : you have to install gluu server and oxd-server in your hosting server to use oxd-node library with your application.

You can install oxd-node using following command:

```sh
$ npm install oxd-node
```
### How to use:

#### 1) register_site

```js
var oxd = require("oxd-node");
oxd.Request.authorization_redirect_uri= "public address of the site";
oxd.register_site(oxd.Request,function(response){
});
```

#### 2) update_site_registration

```js
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";
oxd.Request.authorization_redirect_uri= "public address of the site";
oxd.update_site_registration(oxd.Request,function(response){
});
```

#### 3) get_authorization_url

```js
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";
oxd.Request.acr_values = ["basic"]; //optional, may be skipped (default: basic)
oxd.get_authorization_url(oxd.Request,function(response){
});
```

#### 4) get_authorization_url

```js
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";
oxd.Request.code = "code from OP redirect url";
oxd.get_tokens_by_code(oxd.Request,function(response){
});
```

#### 5) get_user_info

```js
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";
oxd.Request.access_token = "access_token from OP redirect url";
oxd.get_user_info(oxd.Request,function(response){
});
```

#### 6) logout

```js
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";
oxd.logout(oxd.Request,function(response){
});
```

License
-------

(MIT License)

Copyright (c) 2016 Gluu
