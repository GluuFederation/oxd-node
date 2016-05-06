var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

//test case for update_site_registration
describe('Update site', function() {

    it('It should update site registration', function(done) {
      request.oxd_id = "7bcc1697-e1be-493b-aa7c-ceaafd63fa18";
      request.authorization_redirect_uri= "https://ce-dev.gluu.org/.well-known/openid-configuration";
      request.response_types = ["code"];
      request.application_type = "web";
      request.grant_types = ["authorization_code"];
      app.update_site_registration(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in update registration");
          done();
      });
    });


    it('It should not update site registration', function(done) {
      request.oxd_id = null;
      request.authorization_redirect_uri = "http://ce-dev.gluu.org/.well-known/openid-configuration";
      app.update_site_registration(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It update a site registration");
          done();
      });
    });

});
