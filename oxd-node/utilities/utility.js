
var net = require('net');
var httpRequest = require('request');

exports.oxdSocketRequest = function(port,host,param,command,callback) {

        var data = {};
        var client = new net.Socket();
        client.connect(port, host, function() {
        data.command = command;
        data.params = param;
        var string = JSON.stringify(data);
        console.log(string.length);
        console.log('Connected');
        //console.log("Send Data : " + ("0" + string.length + string));
        try {
          if(string.length > 0 && string.length < 100){
            console.log("Send Data1 : " + ("00" + string.length + string));
            client.write(("00" + string.length + string));
          }
          else if(string.length > 100 && string.length < 1000){
              console.log("Send Data2 : " + ("0" + string.length + string));
              client.write(("0" + string.length + string));
          }
        } catch (err) {
            console.log("send data error:" + err);
        }
      });

      client.on('data', function(req) {
        var data = req.toString();
        console.log("response3 : " + data);
        callback(data.substring(4,data.length));
        client.end(); // kill client after server's response
      });

      client.on('error', function(err) {
        console.log('error: ' + err);
        client.end(); // kill client after server's response
      });

      client.on('close', function() {
        console.log('Connection closed');
      });
};

exports.oxdHttpRequest = function(url,param,callback) {
    
    // param = JSON.stringify(param);
    console.log(param);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";//this line is to over come self signed certificate request issue, in real time this should be removed
    httpRequest.post({
            url:url,
            body:param,
            json:true
        },
        function (error, response, body) {
            console.log(error);
            console.log(body);
            console.log(url);
            if (!error && response.statusCode == 200) {
                callback(JSON.stringify(body));
            }
    });
};