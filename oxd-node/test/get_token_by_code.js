var request = require('../model/request_param');
var app = require('../index');
var assert = require('assert');

describe('Get token by code', function() {
    it('It should get token', function(done) {
      request.oxd_id = "7bcc1697-e1be-493b-aa7c-ceaafd63fa18";
      request.code = "c8a7160b-4fac-45a3-8bdf-919e7e6c380b";
      app.get_tokens_by_code(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "ok", "Error in get token by url");
          done();
      });
    });

    it('It should not get token', function(done) {
      request.oxd_id = null;
      request.code = "c8a7160b-4fac-45a3-8bdf-919e7e6c380b";
      app.get_tokens_by_code(request, function(data){
          var jsondata = JSON.parse(data);
          assert.ok(jsondata.status == "error", "It's getting token by url");
          done();
      });
    });

});
