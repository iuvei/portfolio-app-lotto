"use strict";

var express = require('express');
var wallet = require('./wallet');
var transaction = require('./transaction');
var casino_games = require('./casino_games');
var lfg = require('./lfg');
var account = require('./account');
var bank = require('./bank');
var user_info = require('./user_info');
var locale = require('./locale');
var promotion = require('./promotion');
var tags = require('./tags');
var lts = require('./lts');
var loyalty = require('./loyalty');

var router = express.Router();

router.use('/*', (req, res, next) => {
  res.setHeader("Expires", "-1");
  res.setHeader("Cache-Control", "must-revalidate, private");
  next();
});

router.use('/wallet', wallet);
router.use('/transaction', transaction);
router.use('/casinoGames', casino_games);
router.use('/lfg', lfg);
router.use('/account', account);
router.use('/bank', bank);
router.use('/userInfo', user_info);
router.use('/locale', locale);
router.use('/promotion', promotion);
router.use('/tags', tags);
router.use('/lts', lts);
router.use('/loyalty', loyalty);

module.exports = router;
