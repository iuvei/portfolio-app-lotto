"use strict";

var express = require('express');
var request = require ('request-promise');
var config = require ('../config');
var keycloak = require('../keycloak');
var router = express.Router();

router.post('/', (req, response) => {

  let params = req.body;
  let merchant_id = req.body.merchant_id;
  let adminConfig = config.admin_config;
  let wUrl = keycloak.url + '/realms/' + merchant_id + '/protocol/openid-connect/token';

  const options = {
    method: 'POST',
    uri: wUrl,
    form: adminConfig,
    json: true
  };

  request(options)
  .then(function(res) {

    let token = 'Bearer ' + res.access_token;
    let updateUrl = keycloak.url + '/admin/realms/'+ merchant_id +'/users/' + params.user_id;
    let userBody = {
      firstName: params.given_name,
      lastName: params.family_name,
      email: params.email
    }

    const userOptions = {
      method: 'PUT',
      uri: updateUrl,
      body: userBody,
      headers: {
        'Authorization': token
      },
      json: true
    }

    request(userOptions)
    .then(function(userRes){
      return response.status(200).json(userRes);
    })
    .catch(function(err){
      return response.status(500).json(err);
    })

  })
  .catch(function(err) {
    return response.status(500).json(err);
  });

});


router.post('/events', (req, response) => {

  let params = req.body;
  let merchant_id = req.body.merchant_id;
  let adminConfig = config.admin_config;
  let wUrl = keycloak.url + '/realms/' + merchant_id + '/protocol/openid-connect/token';

  const options = {
    method: 'POST',
    uri: wUrl,
    form: adminConfig,
    json: true
  };

  request(options)
  .then(function(res) {

    let token = 'Bearer ' + res.access_token;
    let eventUrl = keycloak.url + '/admin/realms/'+ merchant_id +'/events/?first=0&max=5&type=REGISTER&type=LOGIN&user=' + params.user_id;

    const userOptions = {
      method: 'GET',
      uri: eventUrl,
      headers: {
        'Authorization': token
      }
    }

    request(userOptions)
    .then(function(userRes){
      return response.status(200).json(JSON.parse(userRes));
    })
    .catch(function(err){
      return response.status(500).json(err);
    })

  })
  .catch(function(err) {
    return response.status(500).json(err);
  });

});




module.exports = router;
