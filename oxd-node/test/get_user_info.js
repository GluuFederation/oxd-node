var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

describe('Get user info', function() {
    it('It should get user info', function(done) {
      request.oxd_id = "7bcc1697-e1be-493b-aa7c-ceaafd63fa18";
      request.access_token = "f7844251-09ff-496c-a298-74c8ed6cf929";
      app.get_user_info(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in get user info");
          done();
      });
    });

    it('It should not get user info', function(done) {
      request.oxd_id = ["null"];
      request.access_token = "null";
      app.get_user_info(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It's getting user info");
          done();
      });
    });
});
