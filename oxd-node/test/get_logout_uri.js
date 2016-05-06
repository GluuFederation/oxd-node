var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

describe('Get user info', function() {
    it('It should get user info', function(done) {
      request.oxd_id = "7bcc1697-e1be-493b-aa7c-ceaafd63fa18";
      app.get_logout_uri(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in get user info");
          done();
      });
    });

    it('It should not get user info', function(done) {
      request.oxd_id = null;
      app.get_logout_uri(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It's getting user info");
          done();
      });
    });
});
