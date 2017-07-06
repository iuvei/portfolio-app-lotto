"use strict";

var express = require('express');
var request = require('request-promise');
var config = require('../config');

var router = express.Router();

router.get('/:limit', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id']

  const { limit } = req.params;
  let p_limit = (limit.length > 0) ? "&limit="+limit : '';
  let walletUri = `${config.wallet.transaction}?sort=DESC${p_limit}`;

  const options = {
    method: 'GET',
    uri: walletUri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id
    }
  };
  request(options)
  .then(function(res) {
    return response.status(200).json(res);
  })
  .catch(function(err) {
    return response.status(500).json(err);
  });
});

module.exports = router;
