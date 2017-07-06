"use strict";

var express = require('express');
var request = require ('request-promise');
var config = require ('../config');
var router = express.Router();
var rsmqHelper = require('./rsmq_worker');
var _ = require('lodash');

router.get('/', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id']
  let tagsData = req.headers['x-tags-data']
  let walletUri = config.wallet.find;

  const options = {
    method: 'GET',
    uri: walletUri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id
    }
  };
  if (tagsData) {
    options.headers['x-tags-data'] = tagsData;
  }
  request(options).promise().bind(this)
  .then(function(res) {
    var wallet = JSON.parse(res);
    rsmqHelper.registerUserToChannel(wallet[0].user_id);
    return response.status(200).json(res)
  })
  .catch(function(err) {
    return response.status(500).json(err)
  });
});

router.post('/credit', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id'];
  let secret_key = req.headers['x-secret-key'];
  let paystar_id = req.headers['x-paystar-id'];

  let body = req.body;
  let walletUri = config.wallet.credit;

  const options = {
    method: 'POST',
    uri: walletUri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id,
      'x-secret-key': secret_key,
      'x-paystar-id': paystar_id
    },
    body: body,
    json: true
  };

  request(options)
  .then(function(res) {
    return response.status(200).json(res)
  })
  .catch(function(err) {
    return response.status(500).json(err)
  });
});

router.post('/debit', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id'];
  let secret_key = req.headers['x-secret-key'];
  let paystar_id = req.headers['x-paystar-id'];

  let body = req.body;
  let walletUri = config.wallet.debit;

  const options = {
    method: 'POST',
    uri: walletUri,
    headers: {
      'Authorization': tokenHeader,
      'x-merchant-id': merchant_id,
      'x-secret-key': secret_key,
      'x-paystar-id': paystar_id
    },
    body: body,
    json: true
  };

  request(options)
  .then(function(res) {
    return response.status(200).json(res)
  })
  .catch(function(err) {
    return response.status(500).json(err)
  });
});

router.get('/externalwallet', (req, response) => {
  let walletUri = config.wallet.externalWallet;
  const options = {
    method: 'GET',
    uri: walletUri
  };
  request(options)
  .then(function(res) {
    return response.status(200).json(res)
  })
  .catch(function(err) {
    return response.status(500).json(err)
  });
});

router.post('/transfer', (req, response) => {
  let tokenHeader = req.headers.authorization;
  let merchant_id = req.headers['x-merchant-id'];

  let body = req.body;
  let walletUri = config.wallet.transfer;

  const options = {
    method: 'POST',
    uri: walletUri,
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
    return response.status(500).json(err)
  });
});

module.exports = router;
