var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

describe('Get Authorization URL', function() {

    it('It should get authorization url', function(done) {
      request.oxd_id = "7bcc1697-e1be-493b-aa7c-ceaafd63fa18";
      request.acr_values = ["basic"];
      app.get_authorization_url(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in get authorization url");
          done();
      });
    });

    it('It should not get authorization url', function(done) {
      request.oxd_id = null;
      request.acr_values = ["basic"];
      app.get_authorization_url(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It's getting authorization url");
          done();
      });
    });
});
