"use strict";

let express = require('express');
let request = require('request-promise');
let config = require('../config');

let router = express.Router();

router.get('/rule', (req, response) => {
  request(config.promotionAPI.getRule)
  .then(function(res) {
    return response.status(200).json(res);
  })
  .catch(function(err) {
    return response.status(500).json(err);
  });
});

module.exports = router;
