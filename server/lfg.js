var express = require('express');
var request = require('request-promise');
var config = require('../config');
var _ = require('lodash');

const router = express.Router();

var apicache = require('apicache');
var redis = require('redis');
let cacheWithRedis = apicache
                      .options({
                        redisClient: redis.createClient({ host: config.redisForCache.host, port: config.redisForCache.port }),
                        defaultDuration: config.redisForCache.defaultDuration,
                        statusCodes: {
                          include: [200,304]
                        }
                      })
                      .middleware;

router.get('/drawings/:currency', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getDrawings;

  const { currency } = req.params;
  uri = uri + '?currency=' + currency;

    // headers: {
    //   'Authorization': tokenHeader
    // }
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

router.get('/drawings/:currency/:drawId', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getDrawings;

  const { drawId, currency } = req.params;
  uri = uri + "/" +drawId+ "/" + '?currency=' + currency;

    // headers: {
    //   'Authorization': tokenHeader
    // }
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

router.get('/drawings/:lottery/:currency', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getDrawings;

  const { lottery, next, last, currency } = req.params;
  uri = uri + '?lottery=' + lottery + '&currency=' + currency;

    // headers: {
    //   'Authorization': tokenHeader
    // }
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

// :drawDate = to get game history
router.get('/drawings/:lottery/:drawDate/:currency', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getDrawings;

  const { lottery, next, last, currency, drawDate } = req.params;
  uri = uri + "/" +drawDate+ "/" + '?lottery=' + lottery + '&currency=' + currency;

    // headers: {
    //   'Authorization': tokenHeader
    // }
  const options = {
    method: 'GET',
    uri: uri
  };

  request(options)
  .then(function(res) {
    // console.log('response',response);
    let resObj = JSON.parse(res);
    let gameHistoryData = _.filter(resObj, ['lotteryId', lottery]);
    // console.log('res',gameHistoryData);

    return response.status(200).json(gameHistoryData)
  })
  .catch(function(err) {
    console.log(err);
    return response.status(500).json(err)
  });
});

router.get('/drawings/:lottery/:currency/:next/:last', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getDrawings;

  const { lottery, next, last, currency } = req.params;
  uri = uri + '?lottery=' + lottery + '&currency=' + currency + '&next=' + next + '&last=' + last;

    // headers: {
    //   'Authorization': tokenHeader
    // }
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

router.get('/lotteries', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getLotteries;

    // headers: {
    //   'Authorization': tokenHeader
    // }
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

router.get('/lotteries/:gameId', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.getLotteries;

    // headers: {
    //   'Authorization': tokenHeader
    // }
  const options = {
    method: 'GET',
    uri: uri
  };

  request(options)
  .then(function(res) {
    const gamesList = JSON.parse(res);
    let gameData = _.find(gamesList, ['id', req.params.gameId]);

    return response.status(200).json(gameData)
  })
  .catch(function(err) {
    console.log(err);
    return response.status(500).json(err)
  });
});

// router.get('/prices/:gameId/:currency', (req, response) => {
//   let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
//   let uri = config.lfgAPI.getPrices;

//   const { gameId, currency } = req.params;
//   uri = uri + "/" + gameId + '?currency=' + currency;

//   const options = {
//     method: 'GET',
//     uri: uri,
//     headers: {
//       'Authorization': tokenHeader
//     }
//   };

//   request(options)
//   .then(function(res) {
//     return response.status(200).json(JSON.parse(res))
//   })
//   .catch(function(err) {
//     console.log(err);
//     return response.status(500).json(err)
//   });
// });

router.get('/prices/:currency', cacheWithRedis(), (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let body = req.body;
  let uri = config.lfgAPI.postPrices;

  // uri = uri + "/" + req.params.gameId; //body.gameId;
  let currency = "currency="+req.params.currency;
  // let accessToken = (body.accessToken) ? "&accessToken="+body.accessToken : '';
  body = currency; // + accessToken;

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

router.post('/bet', (req, response) => {
  // let tokenHeader = 'Basic bGxhc2lhLWNueToxMjM0NTY3IQ=='; //req.headers.authorization;
  let uri = config.lfgAPI.postBets;
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

router.post('/openbet', (req, response) => {
  let uri = config.lfgAPI.postOpenBet;
  let body = req.body;
  let accessToken = "accessToken="+body.accessToken;
  let accountId = "accountId="+body.accountId;
  body = accessToken + "&" + accountId;

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

router.post('/bet-history', (req, response) => {
  let uri = config.lfgAPI.postBetHistory;
  let body = req.body;
  let accessToken = "accessToken="+body.accessToken;
  let accountId = "accountId="+body.accountId;
  let beginTime = "beginTime="+body.beginTime;
  let endTime = "endTime="+body.endTime;
  body = accessToken + "&" + accountId + "&" + beginTime + "&" + endTime;

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

router.post('/fetch-lottery-amount', (req, response) => {
  let uri = config.lfgAPI.postFetchLotteryAmt;
  let body = req.body;
  let lotteryId = "lotteryId="+body.lotteryId;
  let type = "type="+body.type;
  body = lotteryId + "&" + type;

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
