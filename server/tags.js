var express = require('express');
var request = require('request-promise');
var config = require('../config');
var _ = require('lodash');

const router = express.Router();

router.post('/', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id']
  let uri = config.tagsAPI.tags;
  let body = req.body;

  const options = {
    method: 'POST',
    uri: uri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id
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

router.get('/categories', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id']
  let uri = config.tagsAPI.categories;

  const options = {
    method: 'GET',
    uri: uri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id
    }
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

module.exports = router;
