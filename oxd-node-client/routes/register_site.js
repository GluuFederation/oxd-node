var oxd = require("oxd-node");
var express = require('express');
var router = express.Router();
var url = require('url');
var jsonfile = require('jsonfile');
var path = require('path');
var setting = path.join(__dirname, '/../settings.json');

router.post('/register_site', function (req, res, next) {
       if (req.body.email == null || req.body.email == "") {
           res.send(400, { error: "Please provide email" });
           return;
       }
       //Define scopes
       var scopes = [];
       scopes.push("openid");
       if(req.body.scope_profile == 1 )
       if(req.body.scope_email == 1 )
           scopes.push("profile");
       if(req.body.scope_email == 1 )
           scopes.push("email");
       if(req.body.scope_address == 1 )
           scopes.push("address");
       if(req.body.scope_clientinfo == 1 )
           scopes.push("clientinfo");
       if(req.body.scope_mobile == 1 )
           scopes.push("mobile_phone");
       if(req.body.scope_phone == 1 )
           scopes.push("phone");

       if(scopes.length > 0)
          oxd.Request.scope = scopes;

       //Define acr_values
       var acr_value = [];
       if(req.body.oxd_openid_gplus_enable == 1 )
           acr_value.push("gplus");
       if(req.body.oxd_openid_basic_enable == 1 )
           acr_value.push("basic");
       if(req.body.oxd_openid_duo_enable == 1 )
           acr_value.push("duo");
       if(req.body.oxd_openid_u2f_enable == 1 )
           acr_value.push("u2f");

       if(acr_value.length > 0)
          oxd.Request.acr_values = acr_value;

       oxd.Request.authorization_redirect_uri= req.protocol + "://" + req.get('host');
       oxd.Request.redirect_uris = [req.protocol + "://" + req.get('host')];
       oxd.Request.post_logout_redirect_uri = req.protocol + "://" + req.get('host');
       oxd.Request.response_types = ["code"];
       oxd.Request.application_type = "web";
       oxd.Request.grant_types = ["authorization_code"];

       var contacts = [];
       contacts.push(req.body.email);
       oxd.Request.contacts = contacts;

       jsonfile.readFile(setting, function(err, obj) {
           if(obj.oxd_id == null || obj.oxd_id == ""){
             oxd.register_site(oxd.Request,function(response){
                  var responsedata = JSON.parse(response);
                  if(responsedata.status == "ok"){
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function (err) {
                    });
                    res.render('success.ejs', { oxd_id: responsedata.data.oxd_id });
                  }
                  else{
                    res.render('home.ejs', { errorName: "Error : " , errorMessage : JSON.stringify(responsedata), errorVisibility: "block" });
                  }
             });
           }
           else{
             oxd.Request.oxd_id = obj.oxd_id;
             oxd.update_site_registration(oxd.Request,function(response){
                  var responsedata = JSON.parse(response);
                  if(responsedata.status == "ok"){
                    obj.oxd_id = responsedata.data.oxd_id;
                    jsonfile.writeFile(setting, obj, function (err) {
                    });
                    console.log("update succeess");
                    res.render('success.ejs', { oxd_id: responsedata.data.oxd_id });
                  }
                  else{
                    res.render('home.ejs', { errorName: "Error : " , errorMessage : JSON.stringify(responsedata), errorVisibility: "block" });
                  }
             });
           }
       });
});

router.post('/updateSite', function (req, res, next) {
      res.render('home.ejs', { errorName: "" , errorMessage : "", errorVisibility: "none" });
});

router.post('/get_url_gplus', function (req, res, next) {
  jsonfile.readFile(setting, function(err,obj) {
    oxd.Request.oxd_id = obj.oxd_id;
    oxd.Request.acr_values = ["gplus"];
    oxd.get_authorization_url(oxd.Request,function(response){
          if(response.length > 0){
            res.status(200).send(response);
            return;
          }
    });
  });
});

router.post('/get_url_basic', function (req, res, next) {
  jsonfile.readFile(setting, function(err,obj) {
    if(err){return {"error":"error"}};
    oxd.Request.oxd_id = obj.oxd_id;
    oxd.Request.acr_values = ["basic"];
    oxd.get_authorization_url(oxd.Request,function(response){
          if(response.length > 0){
            return res.status(200).send(response);
            res.end();
          }
    });
  });
});

router.post('/get_url_duo', function (req, res, next) {
  jsonfile.readFile(setting, function(err,obj) {
    oxd.Request.oxd_id = obj.oxd_id;
    oxd.Request.acr_values = ["duo"];
    oxd.get_authorization_url(oxd.Request,function(response){
          if(response.length > 0){
            res.status(200).send(response);
            return;
          }
    });
  });
});

router.post('/get_url_u2f', function (req, res, next) {
  jsonfile.readFile(setting, function(err,obj) {
    oxd.Request.oxd_id = obj.oxd_id;
    oxd.Request.acr_values = ["u2f"];
    oxd.get_authorization_url(oxd.Request,function(response){
          if(response.length > 0){
            res.status(200).send(response);
            return;
          }
    });
  });
});

router.get('/get_user_info', function (req, res, next) {
  jsonfile.readFile(setting, function(err,obj) {
    var mysession = req.session;
    oxd.Request.oxd_id = obj.oxd_id;
    oxd.Request.access_token = mysession.access_token;
    oxd.get_user_info(oxd.Request,function(response){
          if(response.length > 0){
            var jsondata = JSON.parse(response);
            if(jsondata.status == "ok"){
              res.render("user.ejs", {name : jsondata.data.claims.name[0], email : jsondata.data.claims.email[0], birthdate : jsondata.data.claims.birthdate[0], website : jsondata.data.claims.website[0]})
            }
            else{
              res.render('login.ejs', { title: "Login", errorName: "" , errorMessage : "", errorVisibility: "none" });
            }
          }
    });
  });

});
module.exports = router;
