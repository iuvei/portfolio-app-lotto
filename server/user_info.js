"use strict";

let express = require('express');
let request = require('request-promise');
let config = require('../config');
let rsmq = require('rsmq');

let router = express.Router();

router.post('/fingerprint', (req, response) => {
  let params = req.body;
  // console.log(params);

  let options = config.redisForSMQ;
  let rsmqObj = new rsmq(options);

  let q_name = "user_fingerprint";
  let post_data = {
    message: JSON.stringify(params),
    qname: q_name
  };

  rsmqObj.sendMessage(post_data, function(err1, resp1) {
    if (err1) {
      rsmqObj.createQueue({qname:q_name}, function(err2, resp2) {
        if (err2) {
          return response.status(500).json(err2);
          // console.error("Error: ", err2);
        } else {
          rsmqObj.sendMessage(post_data, function(err3, resp3) {
            if (err3) {
              return response.status(500).json(err3);
              // console.error("Error: ", err3);
            } else {
              return response.status(200).json(resp3);
              // console.log("Sent: ", resp3);
            }
          });
        }
      });
    } else {
      return response.status(200).json(resp1);
      // console.log("Sent: ", resp1);
    }
  });

});

module.exports = router;
