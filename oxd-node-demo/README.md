# oxd-node-demo

oxd-node-demo is demo application which communication protocol of oxD server. This can be used to access the OpenID connect & UMA Authorization end points of the Gluu Server via the oxD. This library provides the function calls required by a website to access user information from a OpenID Connect Provider by the OxD.

## Attention

Application will not be working if your host does not have https://.

### Configure Demo application Port

Once the library is installed, create a copy of the sample configuration file for your website in a server _writable_ location and edit the configuration. For example

```
Go to properties.js,
find exports.port=null and enter port no inplace of "null" which ever is free on your server.
```

## Application Setup

1. Prerequisite : Gluu server and oxd-server need to running in your machine
2. Download source code for demo client application [oxd-node-demo]
3. Configure your port in `properties.js` file in root directory
4. From command line, move into demo client application and enter `npm update`, and run it [node index].
5. Go to web browser and access demo application with this url `https://localhost.com:{port}` (you can use any other port incase if 5053 port is busy in any other process)
6. Register your website with oxd, fill the site registration form and submit it.
7. Now your site user can login using oxd-server

Note : Have a look into this demo video, a screen recording of this demo website’s features.
[Screen Recording](http://screencast.com/t/cvilckj0S3Ye)
