"use strict";

let express = require('express');
let request = require('request-promise');
let config = require('../config');

let router = express.Router();

router.get('/', (req, response) => {
  let bank_config = {
    uri: config.paystar.bank,
    qs: req.query
  };
  request(bank_config)
  .then(function(res) {
    return response.status(200).json(res);
  })
  .catch(function(err) {
    return response.status(500).json(err);
  });
});

module.exports = router;
