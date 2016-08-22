# oxd-node

oxd-node is oxD Server client implemented in node.js, using it you can integrate oxD server in your application.

## Installation

### Note : you have to install gluu server and oxd-server in your hosting server to use oxd-node library with your application.

You can install oxd-node using following command:

```sh
$ npm install oxd-node
```

### Configure the site

Once the library is installed, create a copy of the sample configuration file for your website in a server _writable_ location and edit the configuration. For example

```
in model/request_param.js, find exports.port=null and enter port no inplace of "null" which ever is free on your server.
```

**Note:** The website is registered with the OP and its ID is stored in this config file, also are the other peristant information about the website. So the config file needs to be _writable_ for the server. The [request_param.js](https://github.com/GluuFederation/oxd-node) file contains complete documentation about itself.

## How to use:

### 1) register_site

```javascript
var oxd = require("oxd-node");
oxd.Request.authorization_redirect_uri= "public address of the site";  //REQUIRED
oxd.request.op_host = "public address of the site";                    //OPTIONAL (But if missing, must be present in defaults)
oxd.register_site(oxd.Request,function(response){
});
```

#### Response

```javascript
{
    "status":"ok",
    "data":{
        "oxd_id":"6F9619FF-8B86-D011-B42D-00CF4FC964FF"
    }
}
```

### 2) update_site_registration

```javascript
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";                                  //REQUIRED
oxd.Request.authorization_redirect_uri= "public address of the site"; //OPTIONAL
oxd.update_site_registration(oxd.Request,function(response){
});
```

### 3) get_authorization_url

```javascript
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";                                  //REQUIRED
oxd.Request.acr_values = ["basic"];                                   //OPTIONAL
oxd.get_authorization_url(oxd.Request,function(response){
});
```

### 4) get_tokens_by_code

```javascript
var oxd = require("oxd-node");                                       
oxd.Request.oxd_id = "your site id";                                 //REQUIRED
oxd.Request.code = "code from OP redirect url";                      //OPTIONAL
oxd.request.scopes=[""];                                             //REQUIRED
oxd.get_tokens_by_code(oxd.Request,function(response){
});
```

### 5) get_user_info

```javascript
var oxd = require("oxd-node");                             
oxd.Request.oxd_id = "your site id";                                 //REQUIRED
oxd.Request.access_token = "access_token from OP redirect url";      //REQUIRED
oxd.get_user_info(oxd.Request,function(response){
});
```

### 6) get_logout_uri

```javascript
var oxd = require("oxd-node");
oxd.Request.oxd_id = "your site id";                                 //REQUIRED
oxd.get_logout_uri(oxd.Request,function(response){                   //REQUIRED
});
```

## License

(MIT License)

Copyright (c) 2016 Gluu
