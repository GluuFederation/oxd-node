# oxd-node-demo

oxd-node-demo is demo application which communication protocol of oxD server. This can be used to access the OpenID connect & UMA Authorization end points of the Gluu Server via the oxD. This library provides the function calls required by a website to access user information from a OpenID Connect Provider by the OxD.

###Attention
Application will not be working if your host does not have https://.

### Application Setup

1. Prerequisite : Gluu server and oxd-server need to running in your machine
2. Download source code for demo client application [oxd-node-demo]
3. Configure your id password in `properties.js` file in root directory
4. From command line, move into demo client application and enter `npm update`, and run it [node index].
5. Go to web browser and access demo application with this url `https://localhost.com:5053` (you can use any other port incase if 5053 port is busy in any other process)
6. Register your website with oxd, fill the site registration form and submit it.
7. Now your site user can login using oxd-server
