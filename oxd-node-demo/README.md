# oxd-node-demo

oxd-node-demo is demo application which communication protocol of oxD server. This can be used to access the OpenID connect & UMA Authorization end points of the Gluu Server via the oxD. This library provides the function calls required by a website to access user information from a OpenID Connect Provider by the OxD.

# Installation:

* [Github sources](https://github.com/GluuFederation/oxd-node)
* [Gluu Server](https://www.gluu.org/docs/deployment/ubuntu/)
* [Oxd Server](https://oxd.gluu.org/docs/install/)

**Attention:**
```
Application will not be working if your host does not have https://.
```

**Prerequisite**
```
You have to install gluu server and oxd-server in your hosting server to use oxd-node library with your oxd-node-demo application.
```

# Configuration:

You can set port in .env property file.

# How to use:

1. Download source code for demo client application [oxd-node-demo]
1. From command line, `node index.js`
1. Go to web browser and access demo application with this url `https://localhost.com:{port}` (you can use any other port incase if 5053 port is busy in any other process)
1. Register your website with oxd, fill the site registration form and submit it
1. Log into Gluu server and release the following scopes: `email`,`profile`
1. Now your site user can login using oxd-server

!!! Note
    The command at step two may failed for dependencies reason or key/certificate file raison. In that case install the required dependencies using `npm install` command or generate the key/certificate using `openssl` command. 
