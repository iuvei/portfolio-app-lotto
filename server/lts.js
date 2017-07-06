var express = require('express');
var request = require('request-promise');
var config = require('../config');
var _ = require('lodash');

const router = express.Router();

router.get('/product-state', (req, response) => {
  let uri = config.ltsAPI.getProductState;

  const options = {
    method: 'GET',
    uri: uri
  };

  request(options)
  .then(function(res) {
    return response.status(200).json(JSON.parse(res))
  })
  .catch(function(err) {
    console.log(err);
    return response.status(500).json(err)
  });
});

router.post('/bet', (req, response) => {
  let uri = config.ltsAPI.postBets;
  let body = req.body;
  let accessToken = "accessToken="+body.accessToken;
  let ticketPayload = "ticketPayload="+JSON.stringify(body.ticketPayload);
  body = accessToken + "&" + ticketPayload;

  const options = {
    method: 'POST',
    uri: uri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body,
    json: true
  };

  request(options)
  .then(function(res) {
    return response.status(200).json(res)
  })
  .catch(function(err) {
    console.log(err);
    return response.status(500).json(err)
  });
});



module.exports = router;
