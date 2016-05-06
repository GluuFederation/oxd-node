var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

//test case for register_site
describe('Register site', function() {

    it('It should register a site', function(done) {
      request.authorization_redirect_uri = "https://ce-dev.gluu.org/.well-known/openid-configuration";
      request.response_types = ["code"];
      request.application_type = "web";
      request.grant_types = ["authorization_code"];
      app.register_site(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in registering");
          done();
      });
    });


    it('It should not register a site', function(done) {
      request.authorization_redirect_uri= "http://ce-dev.gluu.org/.well-known/openid-configuration";
      app.register_site(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It registered a site");
          done();
      });
    });

});
